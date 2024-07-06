'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginForm, LoginFormSchema } from './schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HandleLogin } from './server';
import { serialize } from 'object-to-formdata';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Page() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [errorText, setErrorText] = useState<string | null>('');

  const [isSigningIn, setSignInState] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (form: LoginForm) => {
    setSignInState(true);

    const result = JSON.parse(
      await HandleLogin(serialize(form))
    ) as AuthTokenResponsePassword;
    if (result.error) {
      setErrorText(result.error.message);
    } else {
      router.push('/');
    }

    setSignInState(false);
  };

  return (
    <>
    <title>Login | PhiJudge</title>
    <Card className='mx-auto flex w-96 flex-col space-y-2'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login via email address</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='-mt-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='mt-3'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorText && !isSigningIn && (
              <div className='text-sm text-red-500'>{errorText}</div>
            )}

            <div className='mt-4 flex flex-col'>
              <Button className='gap-x-2 px-6' disabled={isSigningIn}>
                <LoaderCircle
                  className={isSigningIn ? 'animate-spin' : 'hidden'}
                  size={14}
                />
                Submit
              </Button>
              <Link href='/auth/register' className='-ml-4 -mt-1'>
                <Button variant={'link'} className='text-blue-500'>
                  Click here to register
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    </>
  );
}
