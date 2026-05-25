import Link from "next/link";

export default function Home() {
    return (
        <div className="p-6">
            {/* Header integrado com a mesma largura e espaçamento do seu app interno */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold">
                        healthy
                    </h1>
                    <p className="text-muted-foreground">
                        Sua aplicação de saúde e bem-estar
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/login"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/register"
                        className="rounded bg-black px-3 py-2 text-sm text-white"
                    >
                        Cadastrar-se
                    </Link>
                </div>
            </div>

            {/* Bloco Central - Mesma estrutura de grid responsivo, cores e bordas do seu layout */}
            <main className="mx-auto max-w-4xl rounded border p-6 my-12">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Coluna da Esquerda: Mensagem Principal */}
                    <div className="flex flex-col justify-center flex-1 space-y-4">
                        <h2 className="text-2xl font-bold">
                            Bem-vindo ao healthy
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Um espaço neutro e informativo para acompanhar seu consumo calórico diário e gerenciar seus ciclos de jejum intermitente de forma consciente e equilibrada.
                        </p>
                    </div>

                    {/* Coluna da Direita: Funcionalidades */}
                    <div className="flex flex-col flex-1 gap-6 justify-between border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-8">
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="font-semibold block text-base mb-1">🍽️ Registro de Calorias</span>
                                <p className="text-muted-foreground">Adicione suas refeições e monitore suas metas diárias com foco em nutrição e saúde.</p>
                            </div>
                            <div>
                                <span className="font-semibold block text-base mb-1">⏱️ Ciclos de Jejum</span>
                                <p className="text-muted-foreground">Monitore seus períodos de jejum intermitente e acompanhe seu progresso semanal.</p>
                            </div>
                        </div>

                        <Link
                            href="/register"
                            className="block text-center rounded bg-black px-3 py-2 text-sm text-white hover:opacity-90 transition-opacity mt-4"
                        >
                            Começar Agora
                        </Link>
                    </div>
                </div>
            </main>

            {/* Rodapé com o Aviso Ético Obrigatório integrado ao padrão */}
            <footer className="mx-auto max-w-4xl text-center text-xs text-muted-foreground pt-6 border-t mt-12">
                <div className="space-y-3">
                    <p>© 2026 healthy. Todos os direitos reservados.</p>
                    <p className="leading-relaxed max-w-2xl mx-auto text-[11px]">
                        ⚠️ <strong>Aviso Importante:</strong> Esta aplicação é um exercício acadêmico para fins didáticos.
                        As ferramentas disponibilizadas servem apenas para acompanhamento pessoal informativo e
                        <strong> não substituem</strong> orientação, diagnóstico ou tratamento médico e nutricional profissional.
                    </p>
                </div>
            </footer>
        </div>
    );
}
