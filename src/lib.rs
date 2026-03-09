use anchor_lang::prelude::*;

declare_id!("56XMjeUnV1vDsEwuCVZMv5g9NNBjXxkZTfH3DyvCs351");

#[program]
pub mod refugio_animales {
    use super::*;

    pub fn crear_refugio(ctx: Context<NuevoRefugio>, nombre: String) -> Result<()> {
        let refugio = &mut ctx.accounts.refugio;

        refugio.owner = *ctx.accounts.owner.key;
        refugio.nombre = nombre;

        Ok(())
    }

    pub fn agregar_mascota(
        ctx: Context<NuevaMascota>,
        nombre: String,
        edad: u8,
        enfermo: bool,
        necesita_esterilizacion: bool,
        viejo: bool,
        mucho_tiempo_sin_adopcion: bool,
    ) -> Result<()> {

        let mascota = &mut ctx.accounts.mascota;
        let refugio = &ctx.accounts.refugio;

        require!(
            refugio.owner == ctx.accounts.owner.key(),
            Errores::NoEresElOwner
        );

        mascota.nombre = nombre;
        mascota.edad = edad;

        mascota.vivo = true;
        mascota.enfermo = enfermo;

        mascota.necesita_esterilizacion = necesita_esterilizacion;
        mascota.esterilizado = false;

        mascota.viejo = viejo;

        mascota.adoptado = false;
        mascota.disponible_adopcion = true;

        mascota.mucho_tiempo_sin_adopcion = mucho_tiempo_sin_adopcion;

        Ok(())
    }

    pub fn eliminar_mascota(_ctx: Context<EliminarMascota>) -> Result<()> {
        Ok(())
    }

    pub fn alternar_adopcion(ctx: Context<AlternarAdopcion>) -> Result<()> {

        let mascota = &mut ctx.accounts.mascota;
        let refugio = &ctx.accounts.refugio;

        require!(
            refugio.owner == ctx.accounts.owner.key(),
            Errores::NoEresElOwner
        );

        mascota.adoptado = !mascota.adoptado;

        msg!(
            "La mascota {} ahora tiene estado adoptado: {}",
            mascota.nombre,
            mascota.adoptado
        );

        Ok(())
    }
}

#[error_code]
pub enum Errores {
    #[msg("No eres el propietario del refugio")]
    NoEresElOwner,
}

#[account]
pub struct Refugio {
    pub owner: Pubkey,
    pub nombre: String,
}

#[account]
pub struct Mascota {

    pub nombre: String,
    pub edad: u8,

    pub vivo: bool,
    pub enfermo: bool,

    pub necesita_esterilizacion: bool,
    pub esterilizado: bool,

    pub viejo: bool,

    pub adoptado: bool,
    pub disponible_adopcion: bool,

    pub mucho_tiempo_sin_adopcion: bool,
}

#[derive(Accounts)]
#[instruction(nombre: String)]
pub struct NuevoRefugio<'info> {

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + nombre.len(),
        seeds = [b"refugio", owner.key().as_ref()],
        bump
    )]
    pub refugio: Account<'info, Refugio>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(nombre: String)]
pub struct NuevaMascota<'info> {

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"refugio", owner.key().as_ref()],
        bump
    )]
    pub refugio: Account<'info, Refugio>,

    #[account(
        init,
        payer = owner,

        // 8 discriminator
        // 4 + nombre.len() string
        // 1 edad
        // 8 bools
        space = 8 + 4 + nombre.len() + 1 + 8,

        seeds = [b"mascota", refugio.key().as_ref(), nombre.as_bytes()],
        bump
    )]
    pub mascota: Account<'info, Mascota>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AlternarAdopcion<'info> {

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"refugio", owner.key().as_ref()],
        bump
    )]
    pub refugio: Account<'info, Refugio>,

    #[account(mut)]
    pub mascota: Account<'info, Mascota>,
}

#[derive(Accounts)]
pub struct EliminarMascota<'info> {

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"refugio", owner.key().as_ref()],
        bump
    )]
    pub refugio: Account<'info, Refugio>,

    #[account(
        mut,
        close = owner
    )]
    pub mascota: Account<'info, Mascota>,
}