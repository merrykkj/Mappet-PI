# Mappet

Projeto Integrador de longo prazo desenvolvido de forma contínua ao longo de todos os semestres (do 1º ao 6º semestre) do curso de Análise e Desenvolvimento de Sistemas da FATEC Ipiranga. O sistema tem como objetivo principal conectar pessoas que encontraram animais com os seus respectivos donos, auxiliando a comunidade local por meio do mapeamento e registro de pets perdidos ou achados.

## Descrição do Projeto

O Mappet é construído sob uma arquitetura unificada onde a interface com o usuário e as regras de negócio são divididas de forma clara. Toda interação realizada pela comunidade na interface pública é enviada para processamento e posteriormente persistida de forma segura. Por se tratar de um Projeto Integrador evolutivo, novos módulos e melhorias são implementados a cada semestre letivo.

## Arquitetura do Sistema

A solução está estruturada em módulos independentes para garantir a separação de conceitos:

*   **Interface Web (mappet-web):** Desenvolvida em HTML, CSS e JavaScript. É a camada visual e pública voltada para a comunidade, permitindo o cadastro de pets perdidos/achados, a realização de buscas estruturadas e o acesso geral a partir de qualquer navegador.
*   **Módulo Funcional (Desktop Java):** Atua diretamente como o motor de processamento (backend) do sistema. Desenvolvido em Java, este módulo isola a lógica de negócios e as regras de processamento das requisições disparadas pelo usuário no site.
*   **Modelo de Dados (MER + DDL):** Camada de banco de dados relacional que unifica o ecossistema. Garante o armazenamento centralizado, a persistência e a integridade de todas as informações de usuários, pets e ocorrências em tempo real.

## Estrutura do Repositório

O repositório está organizado para documentar a evolução cronológica do projeto a cada semestre:

```text
Mappet-PI/
├── documentacao - 1sem/
│   ├── desktop - java/
│   └── projeto_integrador_Fatec.pdf
├── documentacao - 2sem/
│   ├── Arquitetura de Software.pdf
│   ├── Diagrama de Arquitetura.png
│   └── Diagrama de Caso de Uso.png
└── mappet-web/
```

## Tecnologias Utilizadas

*   Frontend: HTML5, CSS3, JavaScript
*   Backend / Lógica de Processamento: Java
*   Persistência: Banco de Dados Relacional (Oracle)

## Contexto Acadêmico

*   **Instituição:** FATEC Ipiranga
*   **Curso:** Análise e Desenvolvimento de Sistemas (ADS)
*   **Período:** Tarde
*   **Duração do Projeto:** Do 1º ao 6º Semestre
*   **Matéria Atual:** Projeto Integrador II (2º Semestre)
*   **Orientação:** Profª. Ana Travassos
