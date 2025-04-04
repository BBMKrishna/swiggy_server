const handlePrismaError = (error) => {
    if (error.code === 'P2002') {
        return {
            status: 400,
            message: 'A record with this value already exists'
        };
    }
    if (error.code === 'P2025') {
        return {
            status: 404,
            message: 'Record not found'
        };
    }
    return {
        status: 500,
        message: 'Internal server error'
    };
}; 