
-- Create enum for question categories
CREATE TYPE public.question_category AS ENUM ('tenant-to-landlord', 'landlord-to-tenant');

-- Create enum for response outcomes
CREATE TYPE public.response_outcome AS ENUM ('positive', 'negative', 'neutral');

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category question_category NOT NULL,
  question TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expected_responses table
CREATE TABLE public.expected_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create actual_responses table
CREATE TABLE public.actual_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  outcome response_outcome NOT NULL DEFAULT 'neutral',
  context TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expected_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actual_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for questions (public read, anyone can insert)
CREATE POLICY "Anyone can view questions" 
  ON public.questions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert questions" 
  ON public.questions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update question votes" 
  ON public.questions 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Create policies for expected_responses (public read, anyone can insert)
CREATE POLICY "Anyone can view expected responses" 
  ON public.expected_responses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert expected responses" 
  ON public.expected_responses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update expected response votes" 
  ON public.expected_responses 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Create policies for actual_responses (public read, anyone can insert)
CREATE POLICY "Anyone can view actual responses" 
  ON public.actual_responses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert actual responses" 
  ON public.actual_responses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update actual response votes" 
  ON public.actual_responses 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_expected_responses_question_id ON public.expected_responses(question_id);
CREATE INDEX idx_actual_responses_question_id ON public.actual_responses(question_id);
