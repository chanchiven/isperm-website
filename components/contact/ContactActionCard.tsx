import {ReactNode} from 'react';
import {HoverableDiv} from '@/components/HoverableDiv';
import {HoverableLink} from '@/components/HoverableLink';
import {
  actionCardStyle,
  actionTitleStyle,
  actionDescStyle,
  iconCircleStyle,
  tealButtonStyle
} from './contactFormStyles';

interface ContactActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  mailtoHref: string;
  buttonText: string;
}

export function ContactActionCard({
  icon,
  title,
  description,
  mailtoHref,
  buttonText
}: ContactActionCardProps) {
  return (
    <HoverableDiv className="hover-lift-card--action" style={actionCardStyle}>
      <div style={{flex: '1'}}>
        <div style={iconCircleStyle}>{icon}</div>
        <h3 className="contact-action-title" style={actionTitleStyle}>
          {title}
        </h3>
        <p className="contact-action-desc" style={actionDescStyle}>
          {description}
        </p>
      </div>
      <div style={{marginTop: '2rem'}}>
        <HoverableLink href={mailtoHref} variant="teal-btn" style={tealButtonStyle}>
          {buttonText}
        </HoverableLink>
      </div>
    </HoverableDiv>
  );
}
