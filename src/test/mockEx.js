import jest from 'jest-mock'

export const mockRequest = (paramsData={},queryData={},bodyData={}, authHeader="", ) => ({
        get(name) {
          if (name === 'authorization') return authHeader
          return null
        },
        body: bodyData,
        params: paramsData,
        query: queryData
})
export const mockResponse = () => {
        const res = {}
        res.status = jest.fn((code)=>{res.statusCode = code; return res})
        res.json = jest.fn((data)=>{res.body = data; return res})
        res.send = jest.fn((data)=>{res.body = data; return res})
        return res;
}

