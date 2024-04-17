import { Input } from "../../../shad/ui/input";
import { useRecoilState } from "recoil";
import { problemId, problemStatementId } from "@repo/store";
import { Label } from "../../../shad/ui/label";

export default function FormHeader() {
  const [LproblemStatementId, setProblemStatementId] = useRecoilState(problemStatementId);

  return (
    <div>
      <Label htmlFor="problem-id">Id:</Label>
      <Input id={"problem-id"} value={LproblemStatementId} onChange={(e) => setProblemStatementId(e.target.value)} />
    </div>
  );
}
