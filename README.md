# Sistema de Redirecionamento Inteligente

Este é um sistema de redirecionamento inteligente que funciona baseado em dispositivo e localização do usuário.

## Configuração

1. Clone este repositório
2. Instale as dependências:
   ```bash
   composer install
   ```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
WHITE_PAGE=https://sua-pagina-branca.com
BLACK_PAGE=https://sua-pagina-preta.com
SECURITY_PARAM_NAME=seu_parametro
SECURITY_PARAM_VALUE=seu_valor
```

## Deploy na Railway

1. Crie uma conta na Railway (https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente na Railway
4. Deploy automático será realizado

## Uso

O sistema redirecionará usuários baseado nas seguintes condições:

- Dispositivo móvel
- Localização (Brasil)
- Parâmetros de segurança válidos
