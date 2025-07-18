import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Calendar, MapPin, ExternalLink, Clock } from 'lucide-react'
import { Opportunity } from '@/types/opportunity'
import { useState } from 'react'

interface OpportunityCardProps {
  opportunity: Opportunity
  onBookmark: (id: string) => void
}

export function OpportunityCard({ opportunity, onBookmark }: OpportunityCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(opportunity.isBookmarked)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark(opportunity.id)
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'unstop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'devfolio': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'hackerearth': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'internship': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
      case 'hackathon': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'contest': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'scholarship': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays <= 7) return `${diffDays} days left`
    return date.toLocaleDateString()
  }

  const isDeadlineSoon = () => {
    const date = new Date(opportunity.deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(opportunity.category)}>
                {opportunity.category}
              </Badge>
              <Badge variant="outline" className={getSourceColor(opportunity.source)}>
                {opportunity.source}
              </Badge>
              {isDeadlineSoon() && (
                <Badge variant="destructive" className="animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {opportunity.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="shrink-0 ml-2"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span className={isDeadlineSoon() ? 'text-destructive font-medium' : ''}>
              {formatDeadline(opportunity.deadline)}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {opportunity.location}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className={getDifficultyColor(opportunity.difficulty)}>
            {opportunity.difficulty}
          </Badge>
          {opportunity.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {opportunity.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.tags.length - 2} more
            </Badge>
          )}
        </div>

        {opportunity.eligibility.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Eligibility:</span> {opportunity.eligibility.join(', ')}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <a href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer">
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}