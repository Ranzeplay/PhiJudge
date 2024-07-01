'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RegisterForm, RegisterFormSchema } from './schema';
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
import { HandleRegister } from './server';
import { serialize } from 'object-to-formdata';
import { AuthResponse } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Page() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      userName: '',
      passwordScope: {
        password: '',
        confirmPassword: '',
      },
    },
  });
  const [errorText, setErrorText] = useState<string | null>('');

  const [isSigningIn, setSignInState] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (form: RegisterForm) => {
    setSignInState(true);

    const result = JSON.parse(
      await HandleRegister(
        serialize({
          email: form.email,
          password: form.passwordScope.password,
          userName: form.userName,
        })
      )
    ) as AuthResponse;
    if (result.error) {
      setErrorText(result.error.message);
    } else {
      router.push('/auth/login');
    }

    setSignInState(false);
  };

  return (
    <Card className='mx-auto flex w-96 flex-col space-y-2'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Register via email address</CardDescription>
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
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='passwordScope.password'
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
            <FormField
              control={form.control}
              name='passwordScope.confirmPassword'
              render={({ field }) => (
                <FormItem className='mt-3'>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='' {...field} />
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
              <Link href='/auth/login' className='-ml-4 -mt-1'>
                <Button variant={'link'} className='text-blue-500'>
                  Click here to login
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
