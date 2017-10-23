using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace DroppedWord
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/Utils.js",
                        "~/Scripts/CoordinateUtil.js",
                        "~/Scripts/element.js",
                        "~/Scripts/DroppedWord.js",
                        "~/Scripts/LineWord.js",
                        "~/Scripts/app.js"));
            
            //BundleTable.EnableOptimizations = true;
        }
    }
}