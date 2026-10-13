// Shown when details.json has not been exported yet
export default function DetailsNotice() {
    return (
        <p className="notice warn" role="alert">
            This section needs <code>details.json</code>. Run the extra export cell in the notebook and copy
            the file into <code>data/exports/json</code>.
        </p>
    );
}