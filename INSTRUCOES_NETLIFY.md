# Configuração Necessária no Netlify

Para que o login e o banco de dados funcionem corretamente, você precisa ativar o **Identity** no painel do Netlify.

### Passo a Passo:

1.  Acesse o painel do seu site em [app.netlify.com](https://app.netlify.com).
2.  Vá em **Site configuration** > **Identity** (no menu lateral).
3.  Clique no botão **"Enable Identity"**.
4.  (Opcional) Em **"Registration preferences"**, verifique se está como "Open" (padrão) para permitir que você crie sua conta.
5.  (Opcional) Em **"External providers"**, você pode ativar login com Google ou GitHub se preferir.

### Testando

1.  Após ativar, acesse a URL do seu jogo (ex: `https://quiz-camara.netlify.app`).
2.  Talvez seja necessário fazer um novo deploy (vá em Deploys > Trigger deploy) para garantir que tudo se conecte, mas geralmente funciona na hora.
3.  Clique em **Login / Signup** no canto superior direito do jogo.
4.  Crie sua conta e confirme o email (se solicitado).

Agora você terá acesso ao histórico e ranking!
