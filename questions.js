// Banco de Questões - Concurso Câmara dos Deputados
// Este arquivo contém todas as perguntas do quiz.
// Cada pergunta tem: enunciado, alternativas, correta (índice 0-3), e explicacao

const QUESTION_BANK = [
    // --- DIREITO CONSTITUCIONAL ---
    {
        enunciado: 'Qual é a função principal do Poder Legislativo?',
        alternativas: [
            'Julgar leis e aplicar sanções.',
            'Administrar o orçamento público federal.',
            'Elaborar leis e fiscalizar o Poder Executivo.',
            'Comandar as Forças Armadas em tempos de paz.'
        ],
        correta: 2,
        explicacao: 'Art. 2º da CF/88: São Poderes da União, independentes e harmônicos, o Legislativo, Executivo e Judiciário. A função típica do Legislativo é elaborar leis e fiscalizar os atos do Executivo.'
    },
    {
        enunciado: 'Quantos Deputados Federais compõem a Câmara dos Deputados?',
        alternativas: [
            '81 Deputados.',
            '513 Deputados.',
            '500 Deputados.',
            '450 Deputados.'
        ],
        correta: 1,
        explicacao: 'Art. 45 da CF/88: A Câmara dos Deputados compõe-se de representantes do povo, eleitos pelo sistema proporcional, em cada Estado e no Distrito Federal. São 513 deputados federais.'
    },
    {
        enunciado: 'Qual a idade mínima para se candidatar ao cargo de Deputado Federal?',
        alternativas: [
            '18 anos.',
            '21 anos.',
            '30 anos.',
            '35 anos.'
        ],
        correta: 1,
        explicacao: 'Art. 14, §3º, VI, c da CF/88: A idade mínima para ser elegível a Deputado Federal é de 21 anos.'
    },
    {
        enunciado: 'Quem substitui o Presidente da República em caso de impedimento, sucessivamente, após o Vice-Presidente?',
        alternativas: [
            'Presidente do Senado Federal.',
            'Presidente do Supremo Tribunal Federal.',
            'Presidente da Câmara dos Deputados.',
            'Procurador-Geral da República.'
        ],
        correta: 2,
        explicacao: 'Art. 80 da CF/88: Em caso de impedimento do Presidente e Vice, serão sucessivamente chamados: Presidente da Câmara, Presidente do Senado e Presidente do STF.'
    },
    {
        enunciado: 'O mandato de um Deputado Federal tem duração de:',
        alternativas: [
            '2 anos.',
            '4 anos.',
            '6 anos.',
            '8 anos.'
        ],
        correta: 1,
        explicacao: 'Art. 44, parágrafo único da CF/88: O mandato dos Deputados Federais é de 4 anos.'
    },
    {
        enunciado: 'A quem compete privativamente autorizar o Presidente da República a declarar guerra?',
        alternativas: [
            'Ao Congresso Nacional.',
            'Ao Senado Federal.',
            'À Câmara dos Deputados.',
            'Ao Supremo Tribunal Federal.'
        ],
        correta: 0,
        explicacao: 'Art. 49, II da CF/88: É competência exclusiva do Congresso Nacional autorizar o Presidente a declarar guerra, celebrar a paz, permitir que forças estrangeiras transitem ou permaneçam no território nacional.'
    },
    {
        enunciado: 'Qual órgão exerce o controle externo da fiscalização contábil, financeira e orçamentária da União?',
        alternativas: [
            'Tribunal de Contas da União (TCU), auxiliando o Congresso.',
            'Ministério da Fazenda.',
            'Controladoria-Geral da União (CGU).',
            'Banco Central.'
        ],
        correta: 0,
        explicacao: 'Art. 70 e 71 da CF/88: O controle externo, a cargo do Congresso Nacional, será exercido com o auxílio do Tribunal de Contas da União.'
    },
    {
        enunciado: 'Em que hipótese a Câmara dos Deputados autoriza a instauração de processo de impeachment contra o Presidente?',
        alternativas: [
            'Por maioria simples (metade + 1 dos presentes).',
            'Por maioria absoluta (257 deputados).',
            'Por dois terços dos seus membros (342 deputados).',
            'Por decisão monocrática do Presidente da Câmara.'
        ],
        correta: 2,
        explicacao: 'Art. 51, I c/c Art. 86 da CF/88: Compete privativamente à Câmara autorizar, por dois terços de seus membros, a instauração de processo contra o Presidente.'
    },
    {
        enunciado: 'Como são eleitos os Deputados Federais?',
        alternativas: [
            'Pelo sistema majoritário simples.',
            'Pelo sistema proporcional.',
            'Pelo sistema majoritário absoluto.',
            'Por indicação das Assembleias Legislativas.'
        ],
        correta: 1,
        explicacao: 'Art. 45 da CF/88: Os Deputados Federais são eleitos pelo sistema proporcional, em cada Estado e no Distrito Federal.'
    },
    {
        enunciado: 'O Regimento Interno da Câmara dos Deputados possui força de:',
        alternativas: [
            'Lei Ordinária.',
            'Resolução, com força normativa interna.',
            'Emenda Constitucional.',
            'Decreto Presidencial.'
        ],
        correta: 1,
        explicacao: 'Art. 51, III e IV da CF/88: O Regimento Interno é aprovado por Resolução da Casa, possuindo caráter normativo interno.'
    },

    // --- PROCESSO LEGISLATIVO ---
    {
        enunciado: 'Quem tem a iniciativa privativa para leis que disponham sobre o regime jurídico dos servidores públicos?',
        alternativas: [
            'Qualquer parlamentar.',
            'O Presidente da República.',
            'O Presidente da Câmara dos Deputados.',
            'O Supremo Tribunal Federal.'
        ],
        correta: 1,
        explicacao: 'Art. 61, §1º, II, c da CF/88: São de iniciativa privativa do Presidente da República as leis que disponham sobre servidores públicos da União.'
    },
    {
        enunciado: 'Quantas sessões legislativas ordinárias há por ano no Congresso Nacional?',
        alternativas: [
            'Uma única sessão contínua.',
            'Duas sessões legislativas.',
            'Três sessões legislativas.',
            'Quatro sessões legislativas.'
        ],
        correta: 1,
        explicacao: 'Art. 57 da CF/88: O Congresso Nacional reunir-se-á, anualmente, em duas sessões legislativas ordinárias: de 2 de fevereiro a 17 de julho e de 1º de agosto a 22 de dezembro.'
    },
    {
        enunciado: 'O que é necessário para aprovação de uma Lei Complementar?',
        alternativas: [
            'Maioria simples dos presentes.',
            'Maioria absoluta da totalidade de membros.',
            'Dois terços dos membros.',
            'Três quintos dos membros.'
        ],
        correta: 1,
        explicacao: 'Art. 69 da CF/88: As leis complementares serão aprovadas por maioria absoluta (metade + 1 da totalidade dos membros).'
    },
    {
        enunciado: 'Em qual das hipóteses abaixo é possível a edição de Medida Provisória?',
        alternativas: [
            'Matéria de direito penal.',
            'Nacionalidade e cidadania.',
            'Relevância e urgência.',
            'Direito eleitoral.'
        ],
        correta: 2,
        explicacao: 'Art. 62 da CF/88: Medida Provisória pode ser editada em caso de relevância e urgência, mas há vedações expressas (direito penal, eleitoral, nacionalidade, etc.).'
    },
    {
        enunciado: 'Qual o prazo de vigência de uma Medida Provisória não convertida em lei?',
        alternativas: [
            '30 dias.',
            '45 dias.',
            '60 dias.',
            '90 dias.'
        ],
        correta: 2,
        explicacao: 'Art. 62, §3º da CF/88: As Medidas Provisórias terão vigência por 60 dias, prorrogáveis uma vez por igual período, se não convertidas em lei.'
    },
    {
        enunciado: 'O veto presidencial pode ser derrubado pelo Congresso Nacional em sessão conjunta por:',
        alternativas: [
            'Maioria simples.',
            'Maioria absoluta.',
            'Dois terços dos votos.',
            'Três quintos dos votos.'
        ],
        correta: 1,
        explicacao: 'Art. 66, §4º da CF/88: O veto será apreciado em sessão conjunta e só poderá ser rejeitado pelo voto da maioria absoluta dos Deputados e Senadores.'
    },
    {
        enunciado: 'Qual o quorum mínimo para aprovação de Emenda Constitucional?',
        alternativas: [
            'Maioria simples em cada Casa.',
            'Maioria absoluta em cada Casa.',
            'Dois terços em cada Casa, em dois turnos.',
            'Três quintos em cada Casa, em dois turnos.'
        ],
        correta: 3,
        explicacao: 'Art. 60, §2º da CF/88: A Emenda à Constituição será promulgada com aprovação de três quintos dos votos em cada Casa, em dois turnos de votação.'
    },
    {
        enunciado: 'Qual Casa legislativa é competente para julgar o Presidente da República por crime de responsabilidade?',
        alternativas: [
            'A Câmara dos Deputados.',
            'O Senado Federal.',
            'O Supremo Tribunal Federal.',
            'O Congresso Nacional em sessão conjunta.'
        ],
        correta: 1,
        explicacao: 'Art. 52, I da CF/88: Compete privativamente ao Senado Federal processar e julgar o Presidente nos crimes de responsabilidade, bem como Ministros de Estado conexos.'
    },
    {
        enunciado: 'Quantos dias o Presidente tem para sancionar ou vetar um projeto de lei?',
        alternativas: [
            '10 dias úteis.',
            '15 dias úteis.',
            '30 dias corridos.',
            '15 dias corridos.'
        ],
        correta: 1,
        explicacao: 'Art. 66 da CF/88: O Presidente da República tem 15 dias úteis para sancionar ou vetar o projeto de lei aprovado.'
    },
    {
        enunciado: 'Sancionado o projeto, a lei é promulgada e publicada. Quando ela entra em vigor, em regra?',
        alternativas: [
            'Imediatamente após publicação.',
            'Após 45 dias da publicação oficial.',
            'Após 90 dias da publicação oficial.',
            'Conforme disposto na própria lei (vacatio legis).'
        ],
        correta: 3,
        explicacao: 'LINDB, Art. 1º: A lei entra em vigor na data que ela própria estabelecer ou, omissa, após 45 dias de sua publicação oficial. Mas há casos de vigência imediata.'
    },

    // --- REGIMENTO INTERNO DA CÂMARA ---
    {
        enunciado: 'Qual é a Mesa Diretora da Câmara dos Deputados?',
        alternativas: [
            'Órgão executivo que representa a Câmara.',
            'Comissão de fiscalização.',
            'Bancada dos líderes partidários.',
            'Secretaria Administrativa.'
        ],
        correta: 0,
        explicacao: 'RICD, Art. 14: A Mesa é o órgão diretor de todos os trabalhos legislativos e administrativos da Câmara dos Deputados.'
    },
    {
        enunciado: 'Qual o mandato do Presidente da Câmara dos Deputados?',
        alternativas: [
            '1 ano, permitida 1 recondução.',
            '2 anos, vedada a recondução.',
            '2 anos, permitida 1 recondução.',
            '4 anos, conforme mandato parlamentar.'
        ],
        correta: 2,
        explicacao: 'Art. 57, §4º da CF/88 c/c RICD: O mandato da Mesa é de 2 anos, vedada a recondução para o mesmo cargo na eleição imediatamente subsequente dentro da mesma legislatura.'
    },
    {
        enunciado: 'As Comissões Permanentes da Câmara têm função de:',
        alternativas: [
            'Aprovar leis definitivamente.',
            'Discutir e votar projetos em caráter terminativo ou emitir pareceres.',
            'Julgar crimes de responsabilidade.',
            'Executar o orçamento da Casa.'
        ],
        correta: 1,
        explicacao: 'RICD, Art. 24 e 32: Comissões Permanentes examinam proposições e emitem pareceres; em casos especiais, aprovam projetos terminativamente (Art. 24, II).'
    },
    {
        enunciado: 'O que é uma Comissão Parlamentar de Inquérito (CPI)?',
        alternativas: [
            'Comissão permanente de fiscalização.',
            'Comissão temporária para investigar fato determinado.',
            'Comissão mista com o Senado.',
            'Comissão para elaboração de PEC.'
        ],
        correta: 1,
        explicacao: 'Art. 58, §3º da CF/88: As CPIs são temporárias e destinadas a apurar fato determinado, com poderes de investigação próprios das autoridades judiciais.'
    },
    {
        enunciado: 'Quantos parlamentares são necessários para criar uma CPI na Câmara?',
        alternativas: [
            'Um quarto dos membros (128 deputados).',
            'Um terço dos membros (171 deputados).',
            'Maioria simples dos presentes.',
            'Maioria absoluta (257 deputados).'
        ],
        correta: 1,
        explicacao: 'Art. 58, §3º da CF/88: A CPI será criada mediante requerimento de um terço dos membros da Câmara dos Deputados.'
    },
    {
        enunciado: 'O que é o "poder terminativo" de uma Comissão?',
        alternativas: [
            'Poder de encerrar sessões.',
            'Poder de aprovar projeto sem passar pelo Plenário.',
            'Poder de vetar proposições.',
            'Poder de convocar ministros.'
        ],
        correta: 1,
        explicacao: 'RICD, Art. 24, II: Em caráter terminativo, a comissão pode discutir e votar projetos dispensados de Plenário, salvo recurso de 1/10 dos membros da Casa.'
    },
    {
        enunciado: 'Como se dá a votação em Plenário da Câmara, em regra?',
        alternativas: [
            'Sempre secreta.',
            'Ostensiva, simbólica ou nominal.',
            'Apenas eletrônica.',
            'Por aclamação apenas.'
        ],
        correta: 1,
        explicacao: 'RICD, Art. 183 e seguintes: As votações são ostensivas, podendo ser simbólicas (verificação visual) ou nominais (eletrônicas ou por chamada). Votação secreta é exceção.'
    },
    {
        enunciado: 'Quando uma matéria tramita em "regime de urgência", qual o prazo máximo para votação?',
        alternativas: [
            '24 horas.',
            '45 dias.',
            'Variável conforme o Regimento.',
            'Não há prazo fixo.'
        ],
        correta: 2,
        explicacao: 'RICD, Art. 151 a 155: O regime de urgência tem prazos variáveis (urgência simples, urgentíssima). Urgência urgentíssima dispensa prazos regimentais e vai direto à Ordem do Dia.'
    },
    {
        enunciado: 'O que é a Ordem do Dia na Câmara?',
        alternativas: [
            'Horário de abertura das sessões.',
            'Parte da sessão destinada à discussão e votação de proposições.',
            'Expediente de comunicações.',
            'Momento de apresentação de projetos.'
        ],
        correta: 1,
        explicacao: 'RICD, Art. 82: A Ordem do Dia é a parte da sessão destinada à discussão e votação de proposições, previamente incluídas na pauta.'
    },
    {
        enunciado: 'Questão de Ordem é:',
        alternativas: [
            'Pedido de esclarecimento sobre interpretação do Regimento.',
            'Solicitação de votação.',
            'Requerimento de urgência.',
            'Proposta de Emenda à Constituição.'
        ],
        correta: 0,
        explicacao: 'RICD, Art. 95: Questão de Ordem é o pedido de pronunciamento do Presidente sobre interpretação e aplicação do Regimento.'
    },

    // --- ORGANIZAÇÃO DA CÂMARA ---
    {
        enunciado: 'Qual o número de membros da Mesa Diretora da Câmara?',
        alternativas: [
            '3 membros.',
            '5 membros.',
            '7 membros.',
            '9 membros.'
        ],
        correta: 2,
        explicacao: 'RICD, Art. 14: A Mesa da Câmara compõe-se de Presidente, 2 Vice-Presidentes, 4 Secretários e 4 Suplentes de Secretário (total 11, mas núcleo executivo são 7).'
    },
    {
        enunciado: 'É atribuição do Presidente da Câmara:',
        alternativas: [
            'Votar em todas as matérias.',
            'Dirigir os trabalhos e promulgar ECs quando há omissão do Presidente da República.',
            'Julgar crimes de responsabilidade.',
            'Nomear ministros do STF.'
        ],
        correta: 1,
        explicacao: 'CF/88, Art. 60, §3º: Promulgação de EC; RICD: Direção dos trabalhos, representação externa, só vota em caso de empate ou votação secreta.'
    },
    {
        enunciado: 'Qual Comissão é responsável pela análise de admissibilidade das proposições?',
        alternativas: [
            'Comissão de Constituição e Justiça (CCJ).',
            'Comissão de Finanças.',
            'Mesa Diretora.',
            'Comissão de Ética.'
        ],
        correta: 0,
        explicacao: 'RICD, Art. 32, IV: À CCJ compete opinar sobre aspectos de constitucionalidade, juridicidade e técnica legislativa.'
    },
    {
        enunciado: 'Líderes partidários na Câmara têm a prerrogativa de:',
        alternativas: [
            'Veto a projetos.',
            'Uso da palavra em qualquer fase da sessão.',
            'Indicar membros para todas as comissões.',
            'Promulgar leis.'
        ],
        correta: 1,
        explicacao: 'RICD, Art. 9º e 10º: Líderes têm prerrogativas como uso da palavra, encaminhamento de votação, indicação para Comissões, apresentação de requerimentos, etc.'
    },
    {
        enunciado: 'A representação proporcional nas Comissões é baseada em:',
        alternativas: [
            'Número de estados representados.',
            'Tamanho das bancadas partidárias ou blocos.',
            'Antiguidade dos parlamentares.',
            'Sorteio.'
        ],
        correta: 1,
        explicacao: 'Art. 58, §1º da CF/88 c/c RICD: A representação nas Comissões é proporcional ao tamanho das bancadas partidárias ou blocos parlamentares.'
    },
    {
        enunciado: 'As sessões da Câmara são, em regra:',
        alternativas: [
            'Secretas.',
            'Públicas.',
            'Restritas aos membros.',
            'Virtuais apenas.'
        ],
        correta: 1,
        explicacao: 'Art. 58, §2º, parte final da CF/88: As sessões das Comissões e do Plenário são públicas, salvo exceções regimentais (ex: votação secreta).'
    },
    {
        enunciado: 'Quantos suplentes cada partido/bloco pode ter em uma Comissão?',
        alternativas: [
            'Número igual ao de titulares.',
            'Metade do número de titulares.',
            'Apenas 1 suplente por Comissão.',
            'Não há suplentes.'
        ],
        correta: 0,
        explicacao: 'RICD, Art. 26: Os partidos/blocos indicam titulares e igual número de suplentes para as Comissões.'
    },
    {
        enunciado: 'A convocação de Ministro de Estado para prestar esclarecimentos é:',
        alternativas: [
            'Facultativa.',
            'Prerrogativa exclusiva do Presidente da República.',
            'Competência da Mesa Diretora ou Comissão.',
            'Vedada pela Constituição.'
        ],
        correta: 2,
        explicacao: 'Art. 50 da CF/88: A Câmara ou suas Comissões podem convocar Ministro de Estado para prestar esclarecimentos, sob pena de crime de responsabilidade se recusar.'
    },
    {
        enunciado: 'O que é "obstrução" parlamentar?',
        alternativas: [
            'Tática para retardar votação.',
            'Veto presidencial.',
            'Impedimento de nova eleição.',
            'Proibição de falar em Plenário.'
        ],
        correta: 0,
        explicacao: 'Prática regimental: Parlamentares usam estratégias como pedidos de verificação de quorum, questões de ordem, etc., para retardar ou impedir votações.'
    },
    {
        enunciado: 'A perda de mandato de Deputado pode ocorrer por:',
        alternativas: [
            'Falta a 3 sessões consecutivas.',
            'Procedimento disciplinar ou judicial (cassação), ou ausências injustificadas.',
            'Decisão unilateral do Presidente da Câmara.',
            'Perda automática após 1 ano de mandato.'
        ],
        correta: 1,
        explicacao: 'Art. 55 da CF/88: Perda de mandato por infração, condenação, perda de direitos políticos, ou falta a 1/3 das sessões em cada sessão legislativa sem justificativa.'
    },

    // --- QUESTÕES MISTAS E AVANÇADAS ---
    {
        enunciado: 'Qual a diferença entre Projeto de Lei Ordinária e Projeto de Lei Complementar?',
        alternativas: [
            'Não há diferença.',
            'PLC exige maioria absoluta; PLO maioria simples.',
            'PLC é de iniciativa exclusiva do Executivo.',
            'PLO não passa pelo Senado.'
        ],
        correta: 1,
        explicacao: 'Art. 69 da CF/88: Leis Complementares exigem maioria absoluta (257 votos) enquanto Ordinárias apenas maioria simples dos presentes.'
    },
    {
        enunciado: 'Qual o procedimento de uma PEC (Proposta de Emenda Constitucional)?',
        alternativas: [
            'Um turno em cada Casa, maioria absoluta.',
            'Dois turnos em cada Casa, três quintos.',
            'Um turno, dois terços.',
            'Aprovação popular em plebiscito.'
        ],
        correta: 1,
        explicacao: 'Art. 60 da CF/88: PEC é discutida e votada em cada Casa, em dois turnos, por 3/5 dos votos (308 deputados e 49 senadores).'
    },
    {
        enunciado: 'São cláusulas pétreas da Constituição:',
        alternativas: [
            'Toda a Constituição.',
            'Forma federativa, voto direto secreto, separação de poderes, direitos fundamentais.',
            'Apenas o Preâmbulo.',
            'Somente os artigos 1º a 4º.'
        ],
        correta: 1,
        explicacao: 'Art. 60, §4º da CF/88: Não pode ser objeto de PEC tendente a abolir: forma federativa, voto direto secreto universal e periódico, separação de poderes, direitos e garantias individuais.'
    },
    {
        enunciado: 'Em que caso o Congresso pode rejeitar integralmente Medida Provisória?',
        alternativas: [
            'Nunca, deve sempre converter.',
            'Por não preencher requisitos de relevância e urgência ou versar sobre matéria vedada.',
            'Apenas se Presidente solicitar.',
            'Automaticamente após 30 dias.'
        ],
        correta: 1,
        explicacao: 'Art. 62 da CF/88: Congresso aprecia MP, podendo rejeitá-la se não atender relevância/urgência ou tratar de tema constitucionalmente vedado.'
    },
    {
        enunciado: 'A imunidade parlamentar material (inviolabilidade) protege o Deputado contra:',
        alternativas: [
            'Qualquer crime.',
            'Opiniões, palavras e votos no exercício do mandato.',
            'Crimes comuns fora do mandato.',
            'Dívidas civis.'
        ],
        correta: 1,
        explicacao: 'Art. 53 da CF/88: Deputados são invioláveis civil e penalmente por quaisquer opiniões, palavras e votos proferidos no exercício do mandato.'
    },
    {
        enunciado: 'A partir de quando o Deputado pode ser processado criminalmente após a diplomação?',
        alternativas: [
            'Imediatamente.',
            'Após autorização da Câmara.',
            'Imediatamente, mas a Câmara pode sustar o processo.',
            'Nunca durante o mandato.'
        ],
        correta: 2,
        explicacao: 'Art. 53, §3º da CF/88: Recebida denúncia contra Deputado, o STF dará ciência à Casa que, por iniciativa de partido, poderá sustar o andamento (maioria absoluta).'
    },
    {
        enunciado: 'Qual o prazo máximo de duração de uma CPI?',
        alternativas: [
            '30 dias.',
            '90 dias.',
            '120 dias, prorrogável.',
            'Não há prazo constitucional definido, mas o Regimento pode fixar.'
        ],
        correta: 3,
        explicacao: 'Art. 58, §3º da CF/88: A CF estabelece prazo determinado para CPI, mas cabe ao Regimento ou ao ato de criação especificar. Comum: 120 dias prorrogáveis.'
    },
    {
        enunciado: 'Qual órgão julga Deputados por crime comum?',
        alternativas: [
            'STF.',
            'STJ.',
            'Justiça comum de 1ª Instância.',
            'A própria Câmara dos Deputados.'
        ],
        correta: 0,
        explicacao: 'Art. 102, I, b da CF/88: Compete ao STF processar e julgar, nas infrações penais comuns, os membros do Congresso Nacional.'
    },
    {
        enunciado: 'O suplente de Deputado assume em que hipótese?',
        alternativas: [
            'Nunca.',
            'Em caso de vaga, licença ou investidura em cargo do Executivo.',
            'A qualquer momento por escolha do titular.',
            'Apenas em caso de morte do titular.'
        ],
        correta: 1,
        explicacao: 'Art. 56 da CF/88: Deputado não perde mandato se investido em cargo de Ministro, Governador, Secretário, etc., mas será substituído pelo suplente; também assume em caso de vaga definitiva.'
    }
];
