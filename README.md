# Prismaを学ぶ

## DockerでPostgreSQLの環境構築をしておく

[こちらを参照](https://zenn.dev/joo_hashi/articles/3702238384488f)

PostgreSQLのコマンド

データベース一覧確認:
```bash
\l
```

データベース変更:
```bash
\c データベース名
```

テーブル一覧を確認:
```bash
\d
```

このコマンドは、Userテーブルのすべてのレコードを選択します。PostgreSQLでは、大文字と小文字を区別するため、テーブル名をダブルクォーテーションで囲む必要があります。

```bash
SELECT * FROM "User";
```


### 環境構築をする

```bash
npm init -y
```

関連するpackageをインストール

```bash
npm install typescript ts-node @types/node --save-dev
```

TypeScriptの設定ファイルであるtsconfig.jsonファイルを作成するためtsc –initコマンドを実行します。本文書ではtsconfig.jsonファイルによるTypeScriptの設定変更は行いません。

```bash
npx tsc --init
```

Prismaをインストール

```bash
npm install prisma --save-dev
```

インストールが完了するとnpx prismaコマンドを実行することができます。npx prismaコマンドを実行するとPrismaで利用できるコマンドのオプションを確認することができます。

```bash
npx prisma
```

Prisma用の設定ファイルを作成するためにnpx prisma initコマンドを実行します。実行するとプロジェクトフォルダにはprismaフォルダと.envファイルが作成されます。prismaフォルダにはPrismaの設定ファイルであるschema.prismaファイルが作成されています。.envファイルはデータベースに接続するために必要となる環境変数を設定するために利用します。

```bash
npx prisma init --datasource-provider postgresql
```

Expressををインストール
```bash
npm install express
```

TypesScript用にExpress.jsの型定義をインストール

```bash
npm install @types/express --save-dev
```

利用するデータベース情報とモデルの設定が完了したのでマイグレーションの実行を行います。マイグレーションを実行することでshema.prismaに記述したモデルを元にデータベースにテーブルを作成することができます。コマンドを実行するとマイグレーションに任意の名前をつける必要があるのでここでは”init”という名前をつけています。

```bash
npx prisma migrate dev
```

データベースに作成されたテーブルへのアクセスはPrisma Studioから行うことができます。Prisma Studioを起動するために”npx prisma sudio”コマンドを実行します。

```bash
npx prisma studio
```

開発環境であれば作成したテーブルをリセットすることができます。一度テーブルが削除され再作成されます。もしデータが保存されている場合には削除してなくなってしまうので注意してください。

```bash
npx prisma migrate reset
```

schema.prismaファイルのモデルを変更した場合(新たなフィールドを追加した削除したり)に”prisma db push”コマンドを実行するとマイグレーションファイルの作成なしにデータベースのテーブルに変更を加えることができます。

```bash
npx prisma db push
```

prisma db pullコマンドを実行した場合は既存のデータベースの状態をschema.prismaファイルに反映されせることができます。もし既存のデータベースが存在している場合にprisma db pullを利用することでスキーマを作成することができる便利な機能です。

```bash
npx prisma db pull
```

Seedingファイルを利用することでマイグレーションの実行時にテーブルにデータを挿入することができます。

prismaフォルダにseed.tsファイルを作成し1件のユーザ情報をテーブルに追加する処理を記述します。

```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  });

  console.log({ alice });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

マイグレーションの実行やresetを行なった時にseedingを自動で行ってくれますが手動で行いたい場合には、”prisma db seed”コマンドを利用することができます。

package.jsonを修正する

```json
{
  "name": "nodejs-prisma",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "prisma": "^5.7.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "express": "^4.18.2"
  }
}
```

```bash
npx prisma db seed
```

nodemonをインストール

```bash
npm install nodemon --save-dev
```

package.jsonを修正

```json
{
  "name": "nodejs-prisma",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "nodemon": "^3.0.2",
    "prisma": "^5.7.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "express": "^4.18.2"
  }
}
```

ローカルサーバーを起動し続けるコマンド

```bash
npm run dev
```

このURLにアクセスする
http://localhost:3000/users/
