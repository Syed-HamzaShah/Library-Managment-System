import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';

const membershipColors = {
    standard: 'bg-secondary text-secondary-foreground',
    premium: 'bg-accent text-accent-foreground',
    student: 'bg-primary/10 text-primary',
};

export function MemberRow({ member, index, onEdit, onDelete }) {
    // Handle user's data structure where name is single string
    const firstName = member.name ? member.name.split(' ')[0] : 'Unknown';
    const lastName = member.name && member.name.split(' ').length > 1 ? member.name.split(' ').slice(1).join(' ') : '';
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
    const membershipType = member.membershipType || 'standard';
    const isActive = member.isActive ?? true;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all"
        >
            <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                        {firstName} {lastName}
                    </h4>
                    <Badge className={cn(membershipColors[membershipType] || membershipColors.standard, 'capitalize')}>
                        {membershipType}
                    </Badge>
                    {!isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                    )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                    </span>
                    <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                    </span>
                </div>
            </div>

            <div className="text-right text-sm text-muted-foreground mr-4">
                <p>Member ID: {member.id}</p>
                <p>Joined: {member.joined_date}</p>
            </div>

            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit?.(member)}>
                    <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete?.(member)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
