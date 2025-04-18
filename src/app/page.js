import Image from "next/image";
import img from "../../public/images/0.png"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, I'm Glow Card</h1>
      <p className="mt-4 text-lg">I am a digital business card.</p>
      <Image
        src={img}
        alt="Glow Card"
        width={500}
        height={500}
        className="mt-8 rounded-lg shadow-lg"
      />
    </main>
  );
}
