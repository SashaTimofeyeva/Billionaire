using Billionare.Engine.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Test
{
    public  class TestConfiguration1
    {
        public BilManager CreateManager()
        {
            var manager = new BilManager();
            manager.AddTable(new BilTableService(Consts.RootAddress,1,0.74));
            return manager;
        }

       public void AddAccounts(BilManager manager)
        {
            for (int i = 0; i < 1000; i++)
            {
                manager.AddAccount(i.ToString(), 1);
            }
        }

    }
}
