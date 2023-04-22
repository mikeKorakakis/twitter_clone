mkdir my-monorepo
cd my-monorepo
git init
mkdir frontend
mkdir backend
npx create-next-app frontend 
npx @nestjs/cli new backend --skip-git
# .gitignore
node_modules/
frontend/.next/
backend/dist/
backend/node_modules/
To work on your projects, you can navigate into the frontend or backend directories and run their respective development servers:

Frontend:

cd frontend
npm run dev
npm run start:dev