'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, X } from 'lucide-react';
import { FormData } from '@/lib/schema';

interface QuestionFormProps {
  form: UseFormReturn<FormData>;
  index: number;
  onRemoveQuestionAction: () => void; // Renamed to comply with convention
}

export function QuestionForm({ form, index, onRemoveQuestionAction }: QuestionFormProps) {
  const questionType = form.watch(`questions.${index}.type`);

  const addOption = () => {
    const currentOptions = form.getValues(`questions.${index}.options`) || [];
    form.setValue(`questions.${index}.options`, [...currentOptions, '']);
  };

  const removeOption = (optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${index}.options`) || [];
    if (currentOptions.length > 2) {
      form.setValue(
        `questions.${index}.options`,
        currentOptions.filter((_, i) => i !== optionIndex)
      );
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium">Question {index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemoveQuestionAction}
          disabled={form.watch('questions').length <= 2}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`questions.${index}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter your question" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SINGLE_CHOICE" />
                    <label>Single Choice</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SHORT_TEXT" />
                    <label>Short Text</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${index}.required`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Required Question</FormLabel>
            </FormItem>
          )}
        />

        {questionType === 'SINGLE_CHOICE' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel>Options</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            {(form.watch(`questions.${index}.options`) || []).map((_, optionIndex) => (
              <div key={optionIndex} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`questions.${index}.options.${optionIndex}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Option ${optionIndex + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(optionIndex)}
                  disabled={(form.watch(`questions.${index}.options`) || []).length <= 2}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}