'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Editor from '@monaco-editor/react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { useForm } from 'react-hook-form';
import { ProblemSubmissionForm, ProblemSubmissionSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { HandleSubmission } from './server';
import { serialize } from 'object-to-formdata';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { LanguageView } from '@/lib/models/language';

export default function Page({ params }: { params: { id: string } }) {
  const [availableProgrammingLanguages, setAvailableProgrammingLanguages] = useState<LanguageView[]>([]);
  useEffect(() => {
    async function fetchLang() {
      const res = await fetch(`/api/v0/lang`);
      const data: LanguageView[] = await res.json();
      setAvailableProgrammingLanguages(data.filter(x => x.agents > 0));
    }

    fetchLang();
  }, []);

  const form = useForm<ProblemSubmissionForm>({
    resolver: zodResolver(ProblemSubmissionSchema),
    defaultValues: {
      problemId: parseInt(params.id),
    },
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  async function onSubmit(data: ProblemSubmissionForm) {
    setSubmitting(true);
    const recordId = await HandleSubmission(serialize(data));
    router.push(`/record/${recordId}`);
    setSubmitting(false);
  }

  return (
    <>
      <title>Submit problem | PhiJudge</title>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid w-full grid-cols-3 gap-4'>
            <div className='col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Editor
                            value={field.value}
                            onChange={field.onChange}
                            language={form.getValues().languageId}
                            height={500}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className='col-span-1 space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='languageId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder='Select language' />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProgrammingLanguages
                                .filter((x) => x.id !== 'unknown' && x.enabled)
                                .map((lang) => (
                                  <SelectItem key={lang.id} value={lang.id}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Additional configurations</Label>

                    <FormField
                      control={form.control}
                      name='enableOptimization'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex flex-row items-center space-x-1'>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='transition'
                              />
                              <p className='text-sm'>Enable optimization</p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='warningAsError'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex flex-row items-center space-x-1'>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='transition'
                              />
                              <p className='text-sm'>Warning as error</p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Button disabled={isSubmitting}>
                <LoaderCircle
                  className={isSubmitting ? 'animate-spin' : 'hidden'}
                  size={14}
                />
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
