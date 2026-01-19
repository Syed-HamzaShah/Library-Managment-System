import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BookCard({ book, onEdit, onDelete, onIssue }) {
    // Use book.available_copies or availableCopies depending on API response.
    // The user's API returns available_copies (snake_case)
    const availableCopies = book.available_copies ?? book.availableCopies ?? 0;
    const isAvailable = availableCopies > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
        >
            {/* Book Cover Placeholder */}
            <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                <BookOpen className="w-16 h-16 text-primary/40" />
                <Badge
                    className={cn(
                        'absolute top-3 right-3',
                        isAvailable ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                    )}
                >
                    {isAvailable ? `${availableCopies} available` : 'Unavailable'}
                </Badge>
            </div>

            {/* Book Info */}
            <div className="p-5">
                <Badge variant="secondary" className="mb-2">
                    {book.category}
                </Badge>
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <p className="text-xs text-muted-foreground mb-4">ISBN: {book.isbn}</p>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1"
                        disabled={!isAvailable}
                        onClick={() => onIssue?.(book)}
                    >
                        Issue Book
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit?.(book)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete?.(book)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
