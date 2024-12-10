'use client'
import FileExplorer from '@/components/FileExplorer'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


export default function Home() {
  const router = useRouter();
  const handleSignout = () => {

    localStorage.removeItem('authenticated')
    router.push('/')
  }
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [router]); // Add router to the dependency array

  return (
    <main className="container mx-auto p-4 bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-white">Quantum Development - Storage</h1>
      <FileExplorer initialPath="/" />
      <Button onClick={handleSignout} className='text-white bg-red-800 w-20 mt-6'>Sair</Button>
    </main>
  );
}
