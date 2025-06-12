
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Users, MessageSquare, CheckCircle, AlertCircle, ThumbsUp, Lock, Plus } from "lucide-react";
import { useQuestions, useCreateQuestion, type QuestionWithResponses } from "@/hooks/useQuestions";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tenant-to-landlord' | 'landlord-to-tenant'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedExpected, setExpandedExpected] = useState<{ [key: string]: boolean }>({});
  const [expandedActual, setExpandedActual] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    question: "",
    expectedResponse: "",
    actualResponse: ""
  });

  const { data: questions = [], isLoading, error } = useQuestions();
  const createQuestion = useCreateQuestion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    createQuestion.mutate({
      question: formData.question,
      expectedResponse: formData.expectedResponse,
      actualResponse: formData.actualResponse || undefined,
      category: 'tenant-to-landlord'
    });
    
    setIsDialogOpen(false);
    setFormData({
      question: "",
      expectedResponse: "",
      actualResponse: ""
    });
  };

  const toggleExpectedResponses = (questionId: string) => {
    setExpandedExpected(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleActualResponses = (questionId: string) => {
    setExpandedActual(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const filteredQuestions = questions.filter(q => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading questions</h3>
          <p className="text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Contribute Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Contribute a Question</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                    Please contribute a question that you thought you could have asked before renting your current flat, and what would have been a good response according to you.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="What question would you have liked to ask?"
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      required
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedResponse">Expected Response *</Label>
                    <Textarea
                      id="expectedResponse"
                      placeholder="What would be an ideal response to this question?"
                      value={formData.expectedResponse}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedResponse: e.target.value }))}
                      required
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualResponse">Actual Response (Optional)</Label>
                    <Textarea
                      id="actualResponse"
                      placeholder="What response did you actually receive? (if any)"
                      value={formData.actualResponse}
                      onChange={(e) => setFormData(prev => ({ ...prev, actualResponse: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      disabled={createQuestion.isPending}
                    >
                      {createQuestion.isPending ? 'Submitting...' : 'Submit Question'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
            <TabsTrigger 
              value="landlord-to-tenant" 
              className="data-[state=active]:bg-white opacity-60 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                For Tenants
              </div>
            </TabsTrigger>
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
                {/* Expected Responses */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Expected Responses ({question.expectedResponses.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add your expected response
                      </Button>
                      {question.expectedResponses.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpectedResponses(question.id)}
                          className="text-xs"
                        >
                          {expandedExpected[question.id] ? 'Show Less' : 'See All'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Show first expected response or no responses message */}
                    {question.expectedResponses.length > 0 ? (
                      <>
                        <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-700 flex-1">
                              {question.expectedResponses[0].response}
                            </p>
                            <div className="flex items-center gap-1 ml-3 text-sm text-gray-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{question.expectedResponses[0].votes}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Show additional expected responses when expanded */}
                        {expandedExpected[question.id] && question.expectedResponses.slice(1).map((expectedResponse) => (
                          <div key={expectedResponse.id} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-start justify-between">
                              <p className="text-gray-700 flex-1">
                                {expectedResponse.response}
                              </p>
                              <div className="flex items-center gap-1 ml-3 text-sm text-gray-600">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{expectedResponse.votes}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                        <p className="text-gray-500 italic">No expected responses yet. Be the first to add one!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actual Responses */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Real Responses ({question.actualResponses.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add your real response
                      </Button>
                      {question.actualResponses.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActualResponses(question.id)}
                          className="text-xs"
                        >
                          {expandedActual[question.id] ? 'Show Less' : 'See All'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Show first actual response or no responses message */}
                    {question.actualResponses.length > 0 ? (
                      <>
                        <div className={`p-3 rounded-lg border-l-4 ${getOutcomeColor(question.actualResponses[0].outcome)}`}>
                          <div className="flex items-start gap-2 mb-2">
                            {getOutcomeIcon(question.actualResponses[0].outcome)}
                            <div className="flex-1">
                              <p className="text-gray-700">"{question.actualResponses[0].response}"</p>
                              <div className="flex items-center justify-between mt-2">
                                {question.actualResponses[0].context && (
                                  <p className="text-sm text-gray-600 italic">
                                    Context: {question.actualResponses[0].context}
                                  </p>
                                )}
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{question.actualResponses[0].votes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Show additional real responses when expanded */}
                        {expandedActual[question.id] && question.actualResponses.slice(1).map((response) => (
                          <div key={response.id} className={`p-3 rounded-lg border-l-4 ${getOutcomeColor(response.outcome)}`}>
                            <div className="flex items-start gap-2 mb-2">
                              {getOutcomeIcon(response.outcome)}
                              <div className="flex-1">
                                <p className="text-gray-700">"{response.response}"</p>
                                <div className="flex items-center justify-between mt-2">
                                  {response.context && (
                                    <p className="text-sm text-gray-600 italic">
                                      Context: {response.context}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{response.votes}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                        <p className="text-gray-500 italic">No real responses yet. Share your experience!</p>
                      </div>
                    )}
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
