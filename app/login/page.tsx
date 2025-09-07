"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, User, Lock, Apple, Chrome, Settings } from "lucide-react"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { SpaceBackground } from "@/components/ui/space-background"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("") // Solo para campos requeridos
  const { login, register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          setErrorMessage("Nombre y apellido son requeridos")
          setIsLoading(false)
          return
        }
        result = await register(email, password, username, firstName, lastName)
      }
      
      if (result.success) {
        router.push("/")
      } else {
        toast({
          title: "Credenciales inválidas",
          description: result.message || "Error en la autenticación",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "Verifica que el backend esté funcionando.",
        variant: "destructive"
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo espacial animado */}
      <SpaceBackground />
      
      {/* Settings icon */}
      <motion.div 
        className="absolute top-6 right-6 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm">
          <Settings className="h-5 w-5" />
        </Button>
      </motion.div>

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
                <AnimatedLogo />
              </div>
              <h1 className="text-2xl font-bold text-white">Lumora</h1>
            </div>
            <p className="text-white/70">Tu universo digital te espera.</p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-black/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Toggle Buttons */}
            <div className="flex mb-6 bg-white/5 rounded-2xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setIsLogin(false)}
                className={`cursor-pointer flex-1 py-3 px-4 rounded-l-xl text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                Regístrate
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`cursor-pointer flex-1 py-3 px-4 rounded-r-xl text-sm font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Inicia sesión
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium block">Email</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-highlight' : 'text-white/50'
                  }`} />
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${
                      focusedField === 'email'
                        ? 'border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20'
                        : 'border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10'
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
                        ease: "easeInOut"
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0,
                      transition: { 
                        duration: 0.3, 
                        ease: "easeInOut"
                      }
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-white/90 text-sm font-medium block">Nombre</label>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                            focusedField === 'firstName' ? 'text-highlight' : 'text-white/50'
                          }`} />
                          <Input
                            type="text"
                            placeholder="Tu nombre"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => setFocusedField(null)}
                            required={!isLogin}
                            className={`w-full pl-10 pr-3 py-3 rounded-xl text-white backdrop-blur-sm transition-all duration-300 bg-transparent text-sm ${
                              focusedField === 'firstName'
                                ? 'border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20'
                                : 'border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/90 text-sm font-medium block">Apellido</label>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                            focusedField === 'lastName' ? 'text-highlight' : 'text-white/50'
                          }`} />
                          <Input
                            type="text"
                            placeholder="Tu apellido"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                            required={!isLogin}
                            className={`w-full pl-10 pr-3 py-3 rounded-xl text-white backdrop-blur-sm transition-all duration-300 bg-transparent text-sm ${
                              focusedField === 'lastName'
                                ? 'border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20'
                                : 'border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                      <label className="text-white/90 text-sm font-medium block">Nombre de usuario</label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                          focusedField === 'username' ? 'text-highlight' : 'text-white/50'
                        }`} />
                        <Input
                          type="text"
                          placeholder="@usuario"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField(null)}
                          required={!isLogin}
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${
                            focusedField === 'username'
                              ? 'border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20'
                              : 'border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <div className="space-y-2 mt-4">
                <label className="text-white/90 text-sm font-medium block">Contraseña</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-highlight' : 'text-white/50'
                  }`} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-white backdrop-blur-sm transition-all duration-300 bg-transparent ${
                      focusedField === 'password'
                        ? 'border-2 border-highlight/50 placeholder-white/50 focus:border-highlight focus:ring-2 focus:ring-highlight/20'
                        : 'border border-white/20 placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10'
                    }`}
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-white/50 mt-2">
                    Usa 8+ caracteres, mezcla letras y números.
                  </p>
                )}
              </div>

              {/* Error Message solo para campos requeridos */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full py-4 bg-gradient-highlight-primary hover:bg-gradient-primary-highlight text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 border-0"
                >
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                </Button>
              </motion.div>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <p className="text-center text-white/50 text-sm mb-4">O regístrate con</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer py-3 bg-black/30 border-white/20 text-white hover:text-white hover:border-white/30 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Apple
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer py-3 bg-black/30 border-white/20 text-white hover:text-white hover:border-white/30 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Google
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
