# Sistema de classificação e geração de respostas por email

Ola tudo bem? Nesse README vou contar como iniciar a aplicação localmente e contar um pouco da historia do desenvolvimento

## Como rodar a aplicação localmente

O projeto está dividido em duas pastas principais: frontend e backend.

### frontend
A pasta frontend contém um projeto Vite puro, sem frameworks adicionais.
Ele é responsável apenas por uma interface simples para interação com a API.

Para rodar o frontend localmente:
```bash
cd frontend
npm install
npm run dev
```

### Backend
A pasta backend contém a API desenvolvida em Python, utilizando FastAPI.
Toda a lógica de classificação, processamento de arquivos e integração com a API do Gemini está concentrada aqui.

O backend possui um Dockerfile, sendo a forma recomendada de execução.

```bash
cd backend
docker build -t email-classifier-api .
docker run -p 8000:8000 email-classifier-api
```

- A api fica disponível em: http://localhost:8000

- A documentação automática pode ser acessada em: http://localhost:8000/docs

## Historia do desenvolvimento

A ideia inicial do projeto era manter todo o processamento de IA rodando localmente, utilizando modelos do Hugging Face tanto para classificação de e-mails quanto para geração de respostas automáticas.
Para a parte de classificação, essa abordagem funcionou muito bem. O modelo escolhido foi o Facebook BART em modo zero-shot classification, que apresentou um bom entendimento do português brasileiro e atendeu ao objetivo sem a necessidade de um fine-tuning complexo.

O principal desafio surgiu na etapa de geração de texto. Modelos de linguagem com qualidade aceitável para esse tipo de tarefa tendem a ser muito mais pesados, alguns chegando facilmente a 20GB ou mais. Manter esse tipo de modelo rodando localmente ou em uma VM implicaria em alto consumo de CPU e memória, além da necessidade de uma GPU com suporte a CUDA para obter um desempenho minimamente viável — o que impactaria diretamente no custo e na complexidade da infraestrutura.

Diante disso, a decisão foi migrar a geração de texto para uma solução cloud-based, utilizando a API do Gemini. Essa escolha trouxe benefícios claros:

- Melhor escalabilidade, já que o sistema não depende mais de recursos locais para geração de texto

- Melhor performance, reduzindo o tempo total de processamento

- Menor complexidade de infraestrutura, eliminando a necessidade de GPUs dedicadas

- Custo mais previsível, pagando apenas pelo uso da API


Com essa mudança, o tempo total de processamento por e-mail caiu de aproximadamente 17 segundos para cerca de 4 segundos, resultando em uma aplicação mais rápida, escalável e preparada para uso em produção.