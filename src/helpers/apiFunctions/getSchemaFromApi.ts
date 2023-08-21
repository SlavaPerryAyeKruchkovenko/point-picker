import Schema from "@Models/schema";
import ApiManager from "@/helpers/apiManager";

const getSchemaFromApi = async <T>(token: string): Promise<Schema<T>[] | undefined> => {
    const res = await new ApiManager().getSchemas({
        session: token
    })
    if (res.status === 200) {
        return res.data.map(data => {
            return {
                id: data.ID,
                name: data.Name,
                groups: []
            }
        })
    }
    return undefined
}
export default getSchemaFromApi