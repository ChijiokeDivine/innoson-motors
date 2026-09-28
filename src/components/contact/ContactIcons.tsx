interface IconProps {
  className?: string;
}

export function MailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path d="m3.5 6 8.5 7 8.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C10.6 20.5 3.5 13.4 3.5 4.9a1 1 0 0 1 1-1H7a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.25 1l-2 2Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocationIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 21.5s7-6.4 7-11.7a7 7 0 1 0-14 0c0 5.3 7 11.7 7 11.7Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.8" r="2.3" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

/** This design recolors every social icon to the site's brand blue rather than native logo colors. */
export function FacebookMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M20.1 16.6h-2.5v8.4h-3.5v-8.4h-1.8v-3h1.8v-2c0-2 .9-3.4 3.5-3.4h2.1v3h-1.3c-1 0-1.1.4-1.1 1.1v1.3h2.6l-.3 3z"
        fill="white"
      />
    </svg>
  );
}

export function LinkedInMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M9.5 13.2h3v9.6h-3v-9.6zm1.5-4.8a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM14.8 13.2h2.9v1.3h.04c.4-.76 1.4-1.56 2.86-1.56 3.06 0 3.6 2 3.6 4.6v5.26h-3v-4.66c0-1.1 0-2.53-1.54-2.53-1.55 0-1.78 1.2-1.78 2.45v4.74h-3v-9.6z"
        fill="white"
      />
    </svg>
  );
}

export function WhatsAppMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M21.7 10.3a6.9 6.9 0 0 0-10.9 8.3l-1 3.7 3.8-1a6.9 6.9 0 0 0 9.9-6.2 6.85 6.85 0 0 0-1.8-4.8zm-5.6 10.6a5.7 5.7 0 0 1-2.9-.8l-.2-.1-2.2.6.6-2.1-.1-.2a5.75 5.75 0 1 1 4.8 2.6zm3.1-4.3c-.2-.1-1-.5-1.2-.5-.2-.1-.3-.1-.4.1s-.5.5-.6.6-.2.2-.4.1a4.6 4.6 0 0 1-1.3-.8 4.9 4.9 0 0 1-.9-1.2c-.1-.2 0-.3.1-.4l.3-.3.2-.3v-.3c0-.1-.4-1-.5-1.3-.1-.3-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.2 2.2 2.2 0 0 0-.7 1.6c0 1 .7 1.9.8 2s1.3 2 3.1 2.8a10 10 0 0 0 1 .4 2.4 2.4 0 0 0 1.1.1c.3-.1 1-.4 1.1-.8.1-.4.1-.7.1-.8-.1-.1-.2-.1-.4-.2z"
        fill="white"
      />
    </svg>
  );
}

export function XMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M21.8 9.5h-2.4l-3.5 4.5-4-4.5H9.5l5.2 5.8-5.2 7.2h2.4l3.8-4.9 4.3 4.9h2.4l-5.5-6.1 5.5-6.9zm-1.3 5.6l-.8-1.2-3 4.1.8 1.2 3-4.1z"
        fill="white"
      />
    </svg>
  );
}

export function InstagramMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M16 9.8c-3.4 0-3.8 0-5.1.1-1.3.1-2 .3-2.5.5-.6.3-1 .6-1.5 1.1-.5.5-.8.9-1.1 1.5-.2.5-.4 1.2-.5 2.5-.1 1.3-.1 1.7-.1 5s0 3.7.1 5.1c.1 1.3.3 2 .5 2.5.3.6.6 1 1.1 1.5.5.5.9.8 1.5 1.1.5.2 1.2.4 2.5.5 1.3.1 1.7.1 5.1.1s3.7 0 5.1-.1c1.3-.1 2-.3 2.5-.5.6-.3 1-.6 1.5-1.1.5-.5.8-.9 1.1-1.5.2-.5.4-1.2.5-2.5.1-1.3.1-1.7.1-5s0-3.7-.1-5.1c-.1-1.3-.3-2-.5-2.5-.3-.6-.6-1-1.1-1.5-.5-.5-.9-.8-1.5-1.1-.5-.2-1.2-.4-2.5-.5-1.3-.1-1.7-.1-5.1-.1zm0 1.8c3.4 0 3.7 0 5 .1 1.2.1 1.8.2 2.3.4.5.2.8.4 1.2.8.4.4.6.7.8 1.2.2.5.3 1.1.4 2.3.1 1.3.1 1.6.1 5s0 3.7-.1 5c-.1 1.2-.2 1.8-.4 2.3-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.5.2-1.1.3-2.3.4-1.3.1-1.6.1-5 .1s-3.7 0-5-.1c-1.2-.1-1.8-.2-2.3-.4-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.2-.5-.3-1.1-.4-2.3-.1-1.3-.1-1.6-.1-5s0-3.7.1-5c.1-1.2.2-1.8.4-2.3.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.5-.2 1.1-.3 2.3-.4 1.3-.1 1.6-.1 5-.1zm0 3.1a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm0 7a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm7.2-7.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"
        fill="white"
      />
    </svg>
  );
}

export function YouTubeMonoIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#005EB8" />
      <path
        d="M22.6 11.8c.1.4.2.9.2 1.4v1.6c0 .5-.1 1-.2 1.4-.2.8-.8 1.4-1.6 1.6-.8.2-2.2.2-4.4.2h-.8c-2.2 0-3.6 0-4.4-.2-.8-.2-1.4-.8-1.6-1.6-.1-.4-.2-.9-.2-1.4v-1.6c0-.5.1-1 .2-1.4.2-.8.8-1.4 1.6-1.6.8-.2 2.2-.2 4.4-.2h.8c2.2 0 3.6 0 4.4.2.8.2 1.4.8 1.6 1.6zm-8.8 5.7L18 15l-4.2-2.5v5z"
        fill="white"
      />
    </svg>
  );
}