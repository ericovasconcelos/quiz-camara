# Configuração Necessária no Netlify

## 1. Ativar Login (Identity)
Para que o login e o cadastro funcionem:
1.  Acesse [app.netlify.com](https://app.netlify.com).
2.  Vá em **Site configuration** > **Identity**.
3.  Clique em **"Enable Identity"**.
4.  Em "Registration preferences", mantenha como "Open".

## 2. Conectar Banco de Dados (Variáveis de Ambiente)
**CRÍTICO:** Para que o Ranking e o Histórico funcionem, você precisa adicionar o endereço do banco de dados no Netlify.

1.  No painel do Netlify, vá em **Site configuration** > **Environment variables**.
2.  Clique em **"Add a variable"**.
3.  **Key**: `DATABASE_URL`
4.  **Value**: (Cole o mesmo valor que você tem no seu arquivo `.env` local)
    *   *Exemplo:* `postgresql://neondb_owner:...........@ep-cool-cloud.us-east-2.aws.neon.tech/neondb?sslmode=require`
5.  Clique em **Create variable**.

## 3. Redeploy
Após adicionar a variável, faça um novo deploy para garantir que as funções peguem o novo valor:
1.  Vá em **Deploys**.
2.  Clique em **Trigger deploy** > **Deploy site**.
