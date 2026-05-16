export const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error) => next(error))
    }
}

// requestHandler is just a fun which is passed in asyncHnadler