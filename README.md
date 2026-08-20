# Auto Peças Nova Opção — sistema de gestão

Painel para uma loja de autopeças acompanhar o negócio num lugar só: estoque,
vendas e financeiro em telas separadas, com o resumo do dia na abertura. No lugar
da planilha que some, quebra a fórmula e ninguém sabe qual é a versão certa.

## As quatro telas

| Tela | O que faz |
| --- | --- |
| **Início** | Resumo do dia: produtos em estoque, produtos com estoque baixo, vendas de hoje e lucro do mês |
| **Estoque** | Cadastro de produtos — nome, descrição, categoria, preço, quantidade e imagem — com edição, exclusão e aviso de estoque baixo |
| **Vendas** | Monta o carrinho a partir do estoque, registra cliente, telefone e forma de pagamento, e fecha a venda |
| **Financeiro** | Lança despesas por categoria (aluguel, salários, impostos, fornecedores, manutenção, água/luz/internet) e mostra o relatório com gráficos |

## Onde os dados ficam

**No próprio navegador**, em `localStorage`, sob três chaves: `products`, `sales`
e `expenses`. Não há servidor nem banco de dados.

Vale saber o que isso significa antes de usar no balcão:

- os dados vivem no computador e no navegador onde foram digitados — outro
  aparelho não enxerga o mesmo estoque;
- limpar os dados de navegação apaga tudo, e não existe backup automático;
- em compensação, nada sai daqui: o que você digita não é enviado para lugar
  nenhum.

Para virar multiusuário, o caminho é trocar o `localStorage` por uma API com banco
de dados. As telas continuariam as mesmas — só a camada que lê e grava mudaria.

## Rodando

Precisa de [Node.js](https://nodejs.org).

```bash
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173`.

Também existem `npm run build`, que gera a pasta `dist/`, e `npm run preview`, que
serve esse build para conferir antes de publicar.

## Stack

- **React 18** com **TypeScript**, empacotado pelo **Vite**
- **Tailwind CSS** e **shadcn/ui** (componentes acessíveis sobre Radix)
- **React Router** nas quatro rotas
- **React Hook Form** com **Zod** nos formulários
- **Recharts** nos gráficos do financeiro
- **date-fns** nas datas e **lucide-react** nos ícones

## Origem do projeto

A base foi gerada com o [Lovable](https://lovable.dev) e ajustada depois. O
histórico do repositório mostra as etapas: a estrutura inicial em Vite + React +
shadcn, o sistema de estoque e financeiro, e por último a troca de nome e os
ajustes de interface.

---

Feito por **Vinicios Muniz** — [github.com/Viniciosmunuz](https://github.com/Viniciosmunuz)
