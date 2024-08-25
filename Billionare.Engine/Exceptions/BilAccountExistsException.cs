namespace Billionare.Engine.Exceptions
{
    public class BilAccountExistsException : BilException
    {
        public BilAccountExistsException() : base(ExceptionConst.AlreadyExistsAccount, "Account already exists")
        {
        }
    }
}
