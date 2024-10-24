# Use a imagem oficial do Node.js como base
FROM node:23

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte do projeto para o contêiner
COPY . .

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]
