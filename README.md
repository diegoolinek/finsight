# 💲Finsight

Aplicacao web para analise de financas pessoais com IA. O backend processa extratos (PDF/imagem), gera transações e agrega dados para o dashboard. O frontend exibe resumo, gastos por categoria e insights.

## Recursos
- Upload de extratos (PDF, JPG, PNG) com processamento assincrono.
- Dashboard com totais, categorias e insight gerado por IA.
- API REST com documentacao Swagger.
- Persistencia em Postgres e fila de tarefas com Redis + Celery.

## Stack
- Backend: Django 5 + Django REST Framework
- Frontend: React + Vite + TypeScript
- Banco: Postgres
- Filas: Redis + Celery

## Estrutura
- backend/: API Django, Celery e processamento de extratos
- frontend/: SPA React
- docker-compose.yml: ambiente completo (db, redis, backend, worker)

## Requisitos
- Docker + Docker Compose
- Ou Python 3.11+ e Node 18+ para rodar localmente

## Como rodar (Docker)
```bash
docker compose up --build
```
Servicos principais:
- Backend: http://localhost:8000
- Docs da API: http://localhost:8000/api/docs/
- Postgres: localhost:5432
- Redis: localhost:6379

## Como rodar (Local)
### Backend
```bash
cd backend
python -m venv .venv
# Ative o ambiente virtual
# Windows (PowerShell): .venv\Scripts\Activate.ps1
# Bash: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Worker (Celery)
```bash
cd backend
celery -A core worker --loglevel=info
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variaveis de ambiente
O `docker-compose.yml` define valores padrao para desenvolvimento. Para customizar, crie um arquivo `.env` na raiz com, por exemplo:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `CELERY_BROKER_URL`
- `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

## API (principais rotas)
- `GET /api/dashboard/`: resumo financeiro e insight
- `POST /api/statements/`: upload de extrato
- `GET /api/transactions/`: lista de transacoes
- `GET /api/docs/`: Swagger UI

## Observacoes
- As rotas da API usam autenticacao do Django/DRF.
- Arquivos enviados ficam em `backend/media/`.

## Licenca (MIT)
Consulte o arquivo LICENSE.txt.

## Autor
- Perfil: https://github.com/diegoolinek

## Como contribuir
- Abra uma issue descrevendo o problema ou sugestao.
- Crie um fork e uma branch com um nome claro (ex.: `feature/nova-tela`).
- Mantenha o escopo pequeno e descreva o que mudou no PR.
- Garanta que o projeto roda localmente (backend + frontend).
