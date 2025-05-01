import Image from "next/image";
import DefinitionForm from './components/DefinitionForm';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          O Que é Amor?
        </h1>
        <p className="text-xl text-center mb-8">
          Compartilhe sua definição de amor e inspire outras pessoas
        </p>
        <DefinitionForm />
      </div>
    </main>
  );
}
