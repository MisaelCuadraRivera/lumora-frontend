"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import {
  Loader2,
  Mail,
  User,
  Lock,
  Apple,
  Chrome,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SpaceBackground } from "@/components/ui/space-background";
import zxcvbn from "zxcvbn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        router.push("/feed");
      } else {
        setErrorMessage(result.message || "Error al iniciar sesión con Google");
      }
    } catch (error) {
      setErrorMessage("Error inesperado al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular fuerza de la contraseña con zxcvbn (retorna 0-4, lo convertimos a 0-5 para las barras)
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    const result = zxcvbn(pwd);
    // zxcvbn retorna score 0-4, lo mapeamos a 1-5 para mejor visualización
    return result.score + 1;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength === 0) return { text: "", color: "" };
    if (strength <= 2) return { text: "Muy débil", color: "text-red-400" };
    if (strength === 3) return { text: "Débil", color: "text-orange-400" };
    if (strength === 4) return { text: "Buena", color: "text-yellow-400" };
    return { text: "Fuerte", color: "text-green-400" };
  };

  const getPasswordStrengthBarColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-orange-500";
    if (strength === 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Generar sugerencias de nombres de usuario
  const generateUsernameSuggestions = () => {
    const adjectives = [
      "cosmic",
      "stellar",
      "lunar",
      "solar",
      "nebula",
      "astro",
      "galactic",
      "phoenix",
      "nova",
      "quasar",
    ];
    const nouns = [
      "dreamer",
      "explorer",
      "voyager",
      "wanderer",
      "seeker",
      "rider",
      "hunter",
      "pilot",
      "knight",
      "sage",
    ];
    const numbers = Math.floor(Math.random() * 999);

    const suggestions = [];
    for (let i = 0; i < 3; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 999);
      suggestions.push(`${adj}_${noun}${num}`);
    }
    setUsernameSuggestions(suggestions);
  };

  useEffect(() => {
    if (!isLogin) {
      generateUsernameSuggestions();
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        // Validaciones para registro
        if (!firstName.trim() || !lastName.trim()) {
          setErrorMessage("Nombre y apellido son requeridos");
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setErrorMessage("La contraseña debe tener al menos 8 caracteres");
          setIsLoading(false);
          return;
        }
        if (!/[a-z]/.test(password)) {
          setErrorMessage(
            "La contraseña debe contener al menos una letra minúscula"
          );
          setIsLoading(false);
          return;
        }
        if (!/[A-Z]/.test(password)) {
          setErrorMessage(
            "La contraseña debe contener al menos una letra mayúscula"
          );
          setIsLoading(false);
          return;
        }
        if (!/\d/.test(password)) {
          setErrorMessage("La contraseña debe contener al menos un número");
          setIsLoading(false);
          return;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
          setErrorMessage(
            "La contraseña debe contener al menos un carácter especial (@, #, $, etc.)"
          );
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("Las contraseñas no coinciden");
          setIsLoading(false);
          return;
        }
        result = await register(email, password, username, firstName, lastName);
      }

      if (result.success) {
        router.push("/feed");
      } else {
        setErrorMessage(
          result.message ||
          "Error en la autenticación. Verifica tus credenciales."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Error de conexión. Verifica que el backend esté funcionando."
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo espacial animado */}
      <SpaceBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="/lumora-logo.png"
                  alt="Logo"
                  className="h-14 w-auto mb-2"
                />
              </div>
            </div>
            <p className="text-white/70">Tu universo digital te espera.</p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Toggle Buttons */}
            <div className="flex mb-6 bg-white/10 rounded-xl p-1 backdrop-blur-sm relative">
              {/* Fondo deslizante animado */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary shadow-lg rounded-lg"
                animate={{
                  x: isLogin ? 0 : "calc(100% + 4px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />

              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`cursor-pointer flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 relative z-10 ${isLogin ? "text-white" : "text-white/70 hover:text-white"
                  }`}
              >
                Inicia sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`cursor-pointer flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 relative z-10 ${!isLogin ? "text-white" : "text-white/70 hover:text-white"
                  }`}
              >
                Regístrate
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium block">
                  Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-4 py-4 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${focusedField === "email"
                        ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                        : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                      }`}
                  />
                </div>
              </div>

              {/* Registration Fields (only for register) */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="registration-fields"
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        duration: 0.4,
                        ease: "easeInOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-white/90 text-sm font-medium block">
                          Nombre
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Tu nombre"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={() => setFocusedField("firstName")}
                            onBlur={() => setFocusedField(null)}
                            required={!isLogin}
                            className={`w-full px-3 py-3 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent text-sm ${focusedField === "firstName"
                                ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                                : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                              }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/90 text-sm font-medium block">
                          Apellido
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Tu apellido"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            onFocus={() => setFocusedField("lastName")}
                            onBlur={() => setFocusedField(null)}
                            required={!isLogin}
                            className={`w-full px-3 py-3 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent text-sm ${focusedField === "lastName"
                                ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                                : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                              }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-white/90 text-sm font-medium block">
                          Nombre de usuario
                        </label>
                        <button
                          type="button"
                          onClick={generateUsernameSuggestions}
                          className="text-xs text-highlight hover:text-highlight/80 flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Generar
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="@usuario"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onFocus={() => setFocusedField("username")}
                          onBlur={() => setFocusedField(null)}
                          required={!isLogin}
                          className={`w-full px-4 py-4 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${focusedField === "username"
                              ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                              : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                            }`}
                        />
                      </div>
                      {/* Sugerencias de nombre de usuario */}
                      {usernameSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {usernameSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setUsername(suggestion)}
                              className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 hover:text-white transition-all duration-200"
                            >
                              @{suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <div className="space-y-2 mt-4">
                <label className="text-white/90 text-sm font-medium block">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!isLogin) {
                        setPasswordStrength(
                          calculatePasswordStrength(e.target.value)
                        );
                      }
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-4 pr-12 py-4 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${focusedField === "password"
                        ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                        : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {!isLogin && password.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {/* Barra de fuerza */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength
                              ? getPasswordStrengthBarColor(passwordStrength)
                              : "bg-white/20"
                            }`}
                        />
                      ))}
                    </div>
                    {/* Etiqueta de fuerza */}
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-medium ${getPasswordStrengthLabel(passwordStrength).color
                          }`}
                      >
                        {getPasswordStrengthLabel(passwordStrength).text}
                      </p>
                      <p className="text-xs text-white/50">
                        Mínimo: mayúscula, minúscula, número y carácter especial
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (only for register) */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="confirm-password"
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        duration: 0.4,
                        ease: "easeInOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <label className="text-white/90 text-sm font-medium block">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        required={!isLogin}
                        className={`w-full px-4 pr-24 py-4 rounded-lg text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${focusedField === "confirmPassword"
                            ? "border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20"
                            : confirmPassword.length > 0
                              ? password === confirmPassword
                                ? "border border-green-500/50 placeholder-white/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
                                : "border border-red-500/50 placeholder-white/40 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                              : "border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10"
                          }`}
                      />
                      {/* Indicador de coincidencia */}
                      {confirmPassword.length > 0 && (
                        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                          {password === confirmPassword ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {/* Mensaje de confirmación */}
                    {confirmPassword.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs mt-2 ${password === confirmPassword
                            ? "text-green-400"
                            : "text-red-400"
                          }`}
                      >
                        {password === confirmPassword
                          ? "✓ Las contraseñas coinciden"
                          : "✗ Las contraseñas no coinciden"}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-xl transition-all duration-300 border-0"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                </Button>
              </motion.div>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/50">
                    O continúa con
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="cursor-pointer h-11 bg-white/95 border-white/20 hover:bg-white hover:border-gray-300 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium">Google</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
