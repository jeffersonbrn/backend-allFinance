-- CreateTable
CREATE TABLE "accountants" (
    "id" SERIAL NOT NULL,
    "companies_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "email" VARCHAR NOT NULL,
    "endereco" VARCHAR,
    "numero" VARCHAR,
    "complemento" VARCHAR,
    "bairro" VARCHAR,
    "cidade" VARCHAR,
    "uf" VARCHAR,
    "crc" VARCHAR NOT NULL,
    "path_certificate_1" VARCHAR,
    "path_certificate_2" VARCHAR,
    "path_certificate_3" VARCHAR,
    "path_doc_1" VARCHAR,
    "path_doc_2" VARCHAR,
    "path_doc_3" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "companies_id" INTEGER,
    "razao_social" VARCHAR,
    "cnpj" VARCHAR,
    "internal_control_number" VARCHAR,
    "rua" VARCHAR,
    "numero" VARCHAR,
    "complemento" VARCHAR,
    "bairro" VARCHAR,
    "municipio" VARCHAR,
    "uf" VARCHAR,
    "cep" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "accountant_id" INTEGER,
    "director_id" INTEGER,
    "pj_qualification_id" INTEGER,
    "pj_forms_of_taxation_id" INTEGER,
    "pj_pis_confins_calculation_id" INTEGER,
    "inscricao_estadual" VARCHAR,
    "inscricao_municipal" VARCHAR,
    "pj_activity_type_id" INTEGER,
    "active" BOOLEAN,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "number_users" INTEGER,
    "image" VARCHAR,
    "resale_plans_id" INTEGER,
    "active" BOOLEAN,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "razao_social" VARCHAR,
    "cnpj" VARCHAR,
    "endereco" VARCHAR,
    "telefone" VARCHAR,
    "numero_endereco" VARCHAR,
    "bairro" VARCHAR,
    "cidade" VARCHAR,
    "cep" VARCHAR,
    "uf" VARCHAR,
    "pais" VARCHAR,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "email" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companies_id" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "type_process" VARCHAR NOT NULL,
    "instructions" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT E'START',
    "fail" BOOLEAN NOT NULL DEFAULT false,
    "last_time_run" TIMESTAMPTZ(6),
    "processing_date" TIMESTAMPTZ(6),
    "clients_id" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" SERIAL NOT NULL,
    "obs" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "icon" VARCHAR,
    "active" BOOLEAN DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules_has_companies" (
    "id" SERIAL NOT NULL,
    "companies_id" INTEGER,
    "modules_id" INTEGER,
    "created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pj_activity_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pj_forms_of_taxation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pj_pis_cofins_calculation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pj_qualifications" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resale_plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "slug" VARCHAR,
    "active" BOOLEAN,
    "clientes" INTEGER,
    "value" DECIMAL(19,2),
    "created" TIME(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIME(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "users_types_id" INTEGER,
    "companies_id" INTEGER,
    "image_path" VARCHAR,
    "active" BOOLEAN DEFAULT true,
    "name" VARCHAR,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_has_clients" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER NOT NULL,
    "clients_id" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_types" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR,
    "active" BOOLEAN,
    "public" BOOLEAN,
    "created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activeSession" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "accountants" ADD FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("accountant_id") REFERENCES "accountants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("director_id") REFERENCES "directors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("pj_activity_type_id") REFERENCES "pj_activity_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("pj_forms_of_taxation_id") REFERENCES "pj_forms_of_taxation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("pj_pis_confins_calculation_id") REFERENCES "pj_pis_cofins_calculation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD FOREIGN KEY ("pj_qualification_id") REFERENCES "pj_qualifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD FOREIGN KEY ("resale_plans_id") REFERENCES "resale_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directors" ADD FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD FOREIGN KEY ("clients_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules_has_companies" ADD FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules_has_companies" ADD FOREIGN KEY ("modules_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("companies_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("users_types_id") REFERENCES "users_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_clients" ADD FOREIGN KEY ("clients_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_clients" ADD FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activeSession" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
