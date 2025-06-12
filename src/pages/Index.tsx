
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Users, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

interface Question {
  id: string;
  category: 'tenant-to-landlord' | 'landlord-to-tenant';
  question: string;
  expectedResponse: string;
  actualResponses: {
    response: string;
    outcome: 'positive' | 'negative' | 'neutral';
    context?: string;
  }[];
  tags: string[];
  votes: number;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    category: 'tenant-to-landlord',
    question: 'What is your policy on repairs and maintenance response times?',
    expectedResponse: 'Emergency repairs within 24 hours, urgent repairs within 3-5 days, non-urgent repairs within 2 weeks. I provide a written maintenance policy.',
    actualResponses: [
      {
        response: 'I handle everything within 24-48 hours max. Here\'s my maintenance policy document.',
        outcome: 'positive',
        context: 'Landlord provided detailed policy, followed through consistently'
      },
      {
        response: 'I get to it when I get to it. Don\'t be so demanding.',
        outcome: 'negative',
        context: 'Multiple maintenance issues took weeks to resolve'
      },
      {
        response: 'Emergency repairs same day, others within a week usually.',
        outcome: 'neutral',
        context: 'Generally responsive but no formal policy'
      }
    ],
    tags: ['maintenance', 'repairs', 'timeline'],
    votes: 127
  },
  {
    id: '2',
    category: 'landlord-to-tenant',
    question: 'How do you plan to care for the property and respect neighbors?',
    expectedResponse: 'I keep my living space clean, follow noise guidelines especially during quiet hours, communicate proactively about any issues, and treat the property with respect.',
    actualResponses: [
      {
        response: 'I\'m very clean and quiet. I work from home so I\'m usually around to keep an eye on things.',
        outcome: 'positive',
        context: 'Excellent tenant, no issues in 2 years'
      },
      {
        response: 'I\'ll do whatever I want, it\'s my home while I pay rent.',
        outcome: 'negative',
        context: 'Multiple noise complaints, property damage'
      },
      {
        response: 'I keep things tidy and try to be considerate of neighbors.',
        outcome: 'neutral',
        context: 'Generally good tenant with minor issues'
      }
    ],
    tags: ['property-care', 'neighbors', 'respect'],
    votes: 89
  },
  {
    id: '3',
    category: 'tenant-to-landlord',
    question: 'Can you provide references from previous tenants?',
    expectedResponse: 'Yes, I can provide contact information for 2-3 previous tenants (with their permission) who can speak about their rental experience.',
    actualResponses: [
      {
        response: 'Absolutely! Here are three references from tenants who lived here in the past two years.',
        outcome: 'positive',
        context: 'All references were positive, landlord was transparent'
      },
      {
        response: 'I don\'t give out personal information about my tenants.',
        outcome: 'negative',
        context: 'Red flag - wouldn\'t provide any references'
      }
    ],
    tags: ['references', 'transparency', 'verification'],
    votes: 156
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tenant-to-landlord' | 'landlord-to-tenant'>('all');

  const filteredQuestions = sampleQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RentalQ&A</h1>
                <p className="text-sm text-gray-600">Community-curated rental insights</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Contribute Question
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Better Rental Relationships Through
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Transparency</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover what questions to ask and what responses to expect. Learn from real interactions between tenants and landlords to make informed decisions.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search questions, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All Questions</TabsTrigger>
            <TabsTrigger value="tenant-to-landlord" className="data-[state=active]:bg-white">For Landlords</TabsTrigger>
            <TabsTrigger value="landlord-to-tenant" className="data-[state=active]:bg-white">For Tenants</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Questions Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={question.category === 'tenant-to-landlord' ? 'default' : 'secondary'}>
                        {question.category === 'tenant-to-landlord' ? 'Tenant → Landlord' : 'Landlord → Tenant'}
                      </Badge>
                      <span className="text-sm text-gray-500">👍 {question.votes}</span>
                    </div>
                    <CardTitle className="text-lg text-gray-900 leading-relaxed">
                      {question.question}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Expected Response */}
                <div className="mb-6">
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Expected Response
                  </h4>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    {question.expectedResponse}
                  </p>
                </div>

                {/* Actual Responses */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Real Responses ({question.actualResponses.length})
                  </h4>
                  <div className="space-y-3">
                    {question.actualResponses.map((response, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${getOutcomeColor(response.outcome)}`}>
                        <div className="flex items-start gap-2 mb-2">
                          {getOutcomeIcon(response.outcome)}
                          <p className="text-gray-700 flex-1">"{response.response}"</p>
                        </div>
                        {response.context && (
                          <p className="text-sm text-gray-600 italic mt-2 ml-6">
                            Context: {response.context}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search or browse all categories</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Built by the community, for the community. Help us improve rental experiences everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
