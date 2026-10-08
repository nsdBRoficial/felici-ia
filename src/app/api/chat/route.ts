import { NextResponse } from "next/server";
import { getGeminiClient, DEFAULT_GEMINI_MODEL } from "@/lib/gemini";
import fs from "fs";
import path from "path";

/**
 * Endpoint de API (Route Handler) para comunicação com o Chatbot da FELICI-IÁ.
 * Método: POST /api/chat
 * 
 * Responsabilidades:
 * 1. Receber a mensagem do usuário e o estado financeiro/comportamental atual do aluno.
 * 2. Ler as diretrizes pedagógicas de `regras_senac.md` para ancorar o modelo de linguagem.
 * 3. Injetar o System Prompt personalizado com os dados do aprendiz.
 * 4. Chamar a API do Google Gemini (modelo gemini-2.5-flash).
 * 5. Oferecer modo de contingência gracioso caso a chave de API não esteja definida.
 */
export async function POST(req: Request) {
  try {
    const { message, userProfile } = await req.json();

    // Validação de entrada: a mensagem é mandatória
    if (!message) {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    // Leitura das regras do Senac a partir do arquivo do projeto para injeção de contexto
    let regrasContext = "";
    try {
      const filePath = path.join(process.cwd(), "regras_senac.md");
      if (fs.existsSync(filePath)) {
        regrasContext = fs.readFileSync(filePath, "utf-8");
      }
    } catch {
      // Ignora falhas de leitura em caso de sandbox ou ambiente restrito
    }

    // Montagem do prompt do sistema com a persona, dados dinâmicos e regras pedagógicas
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
- Quando o aluno falar sobre faltas ou desmotivação, mostre as consequências com carinho e firmeza: a perda da ofensiva e o desconto no valor diário desbloqueado.
- Dê dicas práticas de planejamento financeiro pessoal voltadas para a realidade do primeiro emprego.
- Responda de forma concisa (máximo 2 a 3 parágrafos curtos).
`;

    const gemini = getGeminiClient();

    // Se o cliente da Google GenAI não estiver inicializado (sem chave no .env.local),
    // retorna uma resposta didática e instrutiva sem quebrar a aplicação
    if (!gemini) {
      return NextResponse.json({
        reply: `Olá, ${userProfile?.nome || "Aprendiz"}! 🌟\n\nRecebi sua dúvida: "${message}".\n\n*(Nota técnica do Épico 5: Configure sua chave no arquivo \`.env.local\` como \`GEMINI_API_KEY\` para ativar as respostas dinâmicas do Google Gemini em tempo real!)*\n\nSeu saldo atual desbloqueado é **R$ ${Number(userProfile?.saldo_atual || 0).toFixed(2)}** com **${userProfile?.ofensiva || 0} dias de ofensiva** 🔥!`,
      });
    }

    // Chamada oficial à API do Google Gemini
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
