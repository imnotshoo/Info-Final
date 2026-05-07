import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Sales Monitor</span>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
            <CardDescription className="text-slate-400">
              Something went wrong during authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300">
              There was a problem with the authentication process. This could be due to an expired or invalid link.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
              <Link href="/auth/sign-up">Create New Account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
