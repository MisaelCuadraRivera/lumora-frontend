"use client"

import { FacetManager } from "@/components/profile/facet-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FacetsManagementPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Perfil
          </Button>
        </Link>
      </div>

      <FacetManager />
    </div>
  )
}
                    <SelectItem value="artista">🎨 Artista</SelectItem>
                    <SelectItem value="profesional">💼 Profesional</SelectItem>
                    <SelectItem value="viajero">🌍 Viajero</SelectItem>
                    <SelectItem value="gamer">🎮 Gamer</SelectItem>
                    <SelectItem value="escritor">✍️ Escritor</SelectItem>
                    <SelectItem value="otro">⭐ Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                placeholder="Describe esta faceta de tu personalidad..."
                value={newFacet.description}
                onChange={(e) => setNewFacet({ ...newFacet, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFacet} disabled={!newFacet.name.trim()}>
                Crear Faceta
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Existing Facets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tus Facetas ({user.facets.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {user.facets.map((facet) => (
            <Card key={facet.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={facet.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {facet.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{facet.name}</h3>
                        <Badge variant={facet.isActive ? "default" : "secondary"} className="text-xs">
                          {facet.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {facet.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{facet.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Creado: {new Date().toLocaleDateString()}</span>
                        <span>Última actividad: hace 2 días</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Activo</label>
                      <Switch checked={facet.isActive} onCheckedChange={() => handleToggleActive(facet.id)} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingFacet(facet.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteFacet(facet.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {user.facets.length === 0 && (
        <Card className="border-dashed border-2 border-border/50 bg-transparent">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No tienes facetas aún</h3>
                <p className="text-muted-foreground">
                  Crea tu primera faceta para comenzar a mostrar diferentes aspectos de tu personalidad
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Faceta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
