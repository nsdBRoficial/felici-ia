import { NextResponse } from "next/server";
import { getGeminiClient, DEFAULT_GEMINI_MODEL } from "@/lib/gemini";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { message, userProfile } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    // Leitura das regras do Senac para injeção de contexto (System Prompt)
    let regrasContext = "";
    try {
      const filePath = path.join(process.cwd(), "regras_senac.md");
      if (fs.existsSync(filePath)) {
        regrasContext = fs.readFileSync(filePath, "utf-8");
      }
    } catch {
      // Ignora erro de leitura em caso de ambiente restrito
    }

    const systemInstruction = `
Você é a FELICI-IÁ, mentora de inteligência artificial do jovem aprendiz.
Sua missão é ensinar educação financeira através da lógica "Down-Top", conectando as atividades do Senac e do Trabalho aos ganhos diários do aluno.

DADOS ATUAIS DO ALUNO:
- Nome: ${userProfile?.nome || "Aprendiz"}
- Meta Financeira Mensal: R$ ${Number(userProfile?.meta_mensal || 880).toFixed(2)}
- Saldo Atual Desbloqueado: R$ ${Number(userProfile?.saldo_atual || 0).toFixed(2)}
- Ofensiva (Streak): ${userProfile?.ofensiva || 0} dias consecutivos

DIRETRIZES PEDAGÓGICAS E REGRAS:
${regrasContext}

TOM DE VOZ:
- Jovem, acolhedor, empático, direto e incentivador.
- Use emojis pontualmente (🌟, 🔥, 🎯, 💡).
- Quando o aluno falar sobre faltas ou preguiça, mostre as consequências com empatia: a perda da ofensiva e o desconto no valor diário desbloqueado.
- Dê dicas práticas de planejamento financeiro pessoal voltadas para a realidade do primeiro emprego.
- Responda de forma concisa (máximo 2 a 3 parágrafos curtos).
`;

    const gemini = getGeminiClient();

    // Verifica se a chave GEMINI_API_KEY está configurada
    if (!gemini) {
      return NextResponse.json({
        reply: `Olá, ${userProfile?.nome || "Aprendiz"}! 🌟\n\nRecebi sua dúvida: "${message}".\n\n*(Nota técnica do Épico 5: Configure sua chave no arquivo \`.env.local\` como \`GEMINI_API_KEY\` para ativar as respostas dinâmicas do Google Gemini em tempo real!)*\n\nSeu saldo atual desbloqueado é **R$ ${Number(userProfile?.saldo_atual || 0).toFixed(2)}** com **${userProfile?.ofensiva || 0} dias de ofensiva** 🔥!`,
      });
    }

    const response = await gemini.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Desculpe, não consegui formular uma resposta no momento. Pode repetir?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    return NextResponse.json(
      { error: "Erro interno no processamento com a IA", details: error?.message },
      { status: 500 }
    );
  }
}
