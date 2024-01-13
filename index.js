import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// @supabase/supabase-js
try {
  const text = await fs.readFile("scrimba-info.txt", "utf8");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""], // default setting
  });

  const output = await splitter.createDocuments([text]);

  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
  const openAIApiKey = "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";

  const client = createClient(
    "https://tlfrsuzdxxxjnyyjppka.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZnJzdXpkeHh4am55eWpwcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNjI5NzUsImV4cCI6MjAyMDczODk3NX0.EegEQE-J05Q7WdN12gbhI6JcPFindaiLxSIWieT4gMo"
  );

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      table: "documents",
    }
  );
} catch (err) {
  console.log(err);
}
