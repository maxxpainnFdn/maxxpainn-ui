import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';

export const CopyBtn = ({
  textToCopy,
  buttonText = '',
  copiedText = '',
  icon: Icon = Copy ,
  className = "",
  copiedClassName = "",
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2  rounded-lg transition-colors duration-200  ${copied ? copiedClassName : className }`}
      variant="default"
      {...props}
    >
      {copied ? (
        <span>
          <Check className="w-5 h-5" />
          { copiedText != '' && <span className="ms-1">Copied!</span> }
        </span>
      ) : (
        <>
          <Icon className="w-5 h-5" />
          { buttonText != "" && <span className="ms-1">{buttonText}</span> }
        </>
      )}
    </Button>
  );
};
