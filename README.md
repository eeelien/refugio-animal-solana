# 🐾 Refugio Animal — Solana Program

Programa CRUD desarrollado en **Rust + Anchor** desplegado en Solana Devnet.

## Descripción

Sistema de gestión de refugio animal onchain. Permite registrar mascotas con información médica y de adopción.

## Program ID

`56XMjeUnV1vDsEwuCVZMv5g9NNBjXxkZTfH3DyvCs351`

## Funciones

| Instrucción | Descripción |
|---|---|
| `crear_refugio` | Crea el refugio (PDA) |
| `agregar_mascota` | Registra una mascota con sus datos |
| `eliminar_mascota` | Elimina una mascota del refugio |
| `alternar_adopcion` | Cambia el estado de adopción de una mascota |

## Campos de Mascota

- `nombre` — Nombre de la mascota
- `edad` — Edad en años
- `vivo` — Estado de vida
- `enfermo` — Si está enfermo
- `necesita_esterilizacion` — Si necesita esterilización
- `esterilizado` — Si ya fue esterilizado
- `viejo` — Si es un animal mayor
- `adoptado` — Si fue adoptado
- `disponible_adopcion` — Si está disponible para adopción
- `mucho_tiempo_sin_adopcion` — Si lleva mucho tiempo en el refugio

## Tecnologías

- Rust
- Anchor Framework
- Solana Devnet
- Solana Playground

## Cómo usar en Solana Playground

1. Abre [Solana Playground](https://beta.solpg.io/)
2. Importa este repositorio
3. Haz Build y Deploy
4. Interactúa con las instrucciones desde el panel izquierdo
