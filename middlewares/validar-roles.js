const { response } = require('express')


const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;
    
    if ( rol !== 'DIRECTOR_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}


const tieneRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `EL usuario no tiene el rol permitido para realizar esta acción`,
                location: "params",
            });
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}