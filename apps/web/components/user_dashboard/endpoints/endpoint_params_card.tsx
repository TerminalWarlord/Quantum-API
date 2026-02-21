import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import useSWR from "swr";
import { BACKEND_URL } from "@/lib/config";
import { Endpoint, Parameter } from "@repo/types";
import AddParameter from "./actions/add_parameter";
import { DeleteParameter } from "./actions/delete_parameter";
import { EditParameter } from "./actions/edit_parameter";


type ParamsCardProps = {
    isExpanded: boolean,
    params?: Parameter[],
    endpoint?: Endpoint
}


export default function EndpointParamsCard({ isExpanded, params, endpoint }: ParamsCardProps) {
    return <div>
        <div className="w-full flex justify-between items-center">
            <h3 className="font-medium">Parameters</h3>
            <AddParameter endpoint={endpoint} />
        </div>
        <Table className="my-6">
            <TableHeader>
                <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead className="w-20 text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {params && params.length > 0 && params.map(param => {
                    return <TableRow>
                        <TableCell>
                            <div className="flex space-x-3 items-center">
                                <div className="flex flex-col">
                                    <h1 className="font-medium font-mono">{param.name}</h1>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <p className="px-1 border w-fit h-fit border-cyan-200 rounded-md text-[0.7rem] text-cyan-800 bg-cyan-50">

                                {param.type}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p>

                                {param.is_required ? "YES" : "NO"}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p>

                                {param.default_value}
                            </p>
                        </TableCell>
                        <TableCell className="flex items-center flex-col">
                            <EditParameter parameter={param}/>
                            <DeleteParameter parameter_id={param.id}/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </div>
}