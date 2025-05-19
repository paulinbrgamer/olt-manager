import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
interface LoaderButtonProps {
    isLoading: boolean;
    onClick: () => void;
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; // variantes do shadcn/ui
    className?: string;
}
const LoaderButton: React.FC<LoaderButtonProps> = ({ isLoading, onClick, text, variant = "default", className }) => {
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            className={className}
            variant={variant}
        >
            {isLoading ? <Loader2 className="animate-spin" /> : text}
        </Button>
    );
};

export default LoaderButton;
