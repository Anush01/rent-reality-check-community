
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  id: string;
  category: 'tenant-to-landlord' | 'landlord-to-tenant';
  question: string;
  tags: string[];
  votes: number;
  created_at: string;
  updated_at: string;
}

export interface ExpectedResponse {
  id: string;
  question_id: string;
  response: string;
  votes: number;
  created_at: string;
}

export interface ActualResponse {
  id: string;
  question_id: string;
  response: string;
  outcome: 'positive' | 'negative' | 'neutral';
  context: string | null;
  votes: number;
  created_at: string;
}

export interface QuestionWithResponses extends Question {
  expectedResponses: ExpectedResponse[];
  actualResponses: ActualResponse[];
}

export const useQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async (): Promise<QuestionWithResponses[]> => {
      console.log('Fetching questions from database...');
      
      // Fetch questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      console.log('Fetched questions:', questions);

      // Fetch expected responses
      const { data: expectedResponses, error: expectedError } = await supabase
        .from('expected_responses')
        .select('*')
        .order('votes', { ascending: false });

      if (expectedError) {
        console.error('Error fetching expected responses:', expectedError);
        throw expectedError;
      }

      // Fetch actual responses
      const { data: actualResponses, error: actualError } = await supabase
        .from('actual_responses')
        .select('*')
        .order('votes', { ascending: false });

      if (actualError) {
        console.error('Error fetching actual responses:', actualError);
        throw actualError;
      }

      // Combine data
      const questionsWithResponses: QuestionWithResponses[] = (questions || []).map(question => ({
        ...question,
        expectedResponses: (expectedResponses || []).filter(er => er.question_id === question.id),
        actualResponses: (actualResponses || []).filter(ar => ar.question_id === question.id)
      }));

      console.log('Questions with responses:', questionsWithResponses);
      return questionsWithResponses;
    }
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      question: string;
      expectedResponse: string;
      actualResponse?: string;
      category?: 'tenant-to-landlord' | 'landlord-to-tenant';
      tags?: string[];
    }) => {
      console.log('Creating question:', data);

      // Create the question
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          question: data.question,
          category: data.category || 'tenant-to-landlord',
          tags: data.tags || []
        })
        .select()
        .single();

      if (questionError) {
        console.error('Error creating question:', questionError);
        throw questionError;
      }

      console.log('Created question:', question);

      // Create the expected response
      if (data.expectedResponse) {
        const { error: expectedError } = await supabase
          .from('expected_responses')
          .insert({
            question_id: question.id,
            response: data.expectedResponse
          });

        if (expectedError) {
          console.error('Error creating expected response:', expectedError);
          throw expectedError;
        }
      }

      // Create the actual response if provided
      if (data.actualResponse) {
        const { error: actualError } = await supabase
          .from('actual_responses')
          .insert({
            question_id: question.id,
            response: data.actualResponse,
            outcome: 'neutral'
          });

        if (actualError) {
          console.error('Error creating actual response:', actualError);
          throw actualError;
        }
      }

      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: "Success!",
        description: "Your question has been submitted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    }
  });
};
