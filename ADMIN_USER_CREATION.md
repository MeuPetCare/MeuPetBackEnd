# Criação de Usuário Administrador

Este guia mostra como criar um usuário administrador no sistema MeuPet.

## 1. Gerar Hash da Senha

### Opção A: Usando script Node.js
```bash
# Execute no terminal para gerar o hash bcrypt
node tmp_rovodev_generate_hash.js "suaSenhaAqui"
```

### Opção B: Usando container do app
```bash
# Conectar no container do app
docker exec -it meupet-app-dev node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log('Hash:', hash))"
```

## 2. Conectar no MySQL e Criar Usuário

### Conectar no banco de dados
```bash
# Conectar no container do banco
docker exec -it meupet-db-dev mysql -u root -proot MeuPet
```

### Inserir usuário no MySQL
```sql
-- Inserir usuário administrador
INSERT INTO user (email, passwordHash, fullName, phone, crmv, specialty, roles, isActive) 
VALUES (
  'admin@meupet.com',
  '$2b$10$HASH_GERADO_AQUI',  -- substitua pelo hash gerado
  'Administrador',
  '11999999999',
  NULL,
  NULL,
  '["admin"]',
  1
);

-- Verificar se foi criado
SELECT id, email, fullName, roles FROM user WHERE email = 'admin@meupet.com';
```

## 3. Comando Completo (Recomendado)

Este comando gera o hash e mostra o SQL pronto para usar:

```bash
# Gerar hash e mostrar comando SQL pronto
docker exec -it meupet-app-dev node -e "
const bcrypt = require('bcrypt'); 
bcrypt.hash('admin123', 10).then(hash => {
  console.log('🔐 Hash gerado:', hash);
  console.log('\n📋 Execute este SQL no MySQL:');
  console.log(\`INSERT INTO user (email, passwordHash, fullName, phone, roles, isActive) VALUES ('admin@meupet.com', '\${hash}', 'Administrador', '11999999999', '[\"admin\"]', 1);\`);
})"
```

## 4. Teste de Login

Após criar o usuário, teste o login na API:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@meupet.com",
    "password": "senha"
  }'
```

## 5. Trocar Senha do Usuário

Se você precisa alterar a senha de um usuário existente:

### Gerar novo hash
```bash
# Gerar hash da nova senha
docker exec -it meupet-app-dev node -e "
const bcrypt = require('bcrypt'); 
bcrypt.hash('senha', 10).then(hash => {
  console.log('🔐 Novo hash gerado:', hash);
  console.log('\n📋 Execute este SQL para atualizar:');
  console.log(\`UPDATE user SET passwordHash = '\${hash}' WHERE email = 'admin@meupet.com';\`);
})"
```

### Atualizar no banco de dados
```bash
# Conectar no banco
docker exec -it meupet-db-dev mysql -u root -proot MeuPet
```

```sql
-- Trocar senha do usuário (substitua pelo hash gerado acima)
UPDATE user SET passwordHash = '$2b$10$NOVO_HASH_AQUI' WHERE email = 'admin@meupet.com';

-- Verificar se foi atualizada
SELECT email, fullName, LENGTH(passwordHash) as hash_length FROM user WHERE email = 'admin@meupet.com';
```

### Comando completo para trocar senha
```bash
# Exemplo: trocar para senha "novasenha123"
docker exec -it meupet-app-dev node -e "
const bcrypt = require('bcrypt'); 
bcrypt.hash('novasenha123', 10).then(hash => {
  console.log('🔐 Hash da nova senha:', hash);
  console.log('\n📋 SQL para executar no MySQL:');
  console.log(\`UPDATE user SET passwordHash = '\${hash}' WHERE email = 'admin@meupet.com';\`);
  console.log('\n✅ Depois execute: SELECT email FROM user WHERE email = \"admin@meupet.com\" AND passwordHash = \"' + hash + '\";');
})"
```

## Notas Importantes

- **Senha padrão**: `admin123` (altere conforme necessário)
- **Email padrão**: `admin@meupet.com` (altere conforme necessário)
- **Role**: `["admin"]` - garante acesso administrativo
- **isActive**: `1` - usuário ativo no sistema
- O campo `passwordHash` usa bcrypt com salt rounds = 10
- **Para trocar senha**: Use a seção 5 acima

## Estrutura da Tabela User

```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  crmv VARCHAR(50) UNIQUE,
  specialty VARCHAR(100),
  roles JSON NOT NULL,
  isActive BOOLEAN DEFAULT TRUE
);
```