// src/components/Logo.jsx
export const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <h1 className={`font-heading font-bold gradient-text ${sizes[size]}`}>
      ScreenSense
    </h1>
  );
};
