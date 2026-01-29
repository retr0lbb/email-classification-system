# Sistema de classificação e geração de respostas por email

Ola tudo bem? Nesse README vou contar como iniciar a aplicação localmente e contar um pouco da historia do desenvolvimento

## Como rodar a aplicação localmente




## Historia do desenvolvimento
Primeiro eu pensei que usar tanto um modelo de classificação quanto um modelo de geração de texto localmente com o HF(Hugging Face) seria a melhor estrategia, porem eu estava errado, o fato é que o modelo de classificacao escolhido funcionava muito bem, usei o Facebook-BART para um modelo de zero-shot classification pois é um modelo que tem um certo entendimento da linguagem Portugues Brasil e nao seria necessario fazer quase que nenhum fine tuning.
Porém o desafio comecou com o modelo de geracao de texto, por serem modelos mais pesados com modelos chegando a ate 27gb decidi que iria tanto priorizar a qualidade de entrega dos textos, o que nao era possivel em modelos LLM menores e tambem decidi priorizar o custo, ja que um agente desses rodando em uma maquina virtual iriam consumir muita cpu e memoria, sendo precisos uma gpu com suporte a CUDA para rodarem de forma eficiente. decidi entao optar por usar a api do Gemini pois sendo uma IA cloud nao teriamos problemas com infraestrutura;

processamento total caiu de 6 para 2 segundos




### exemplos
